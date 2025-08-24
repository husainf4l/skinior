import os
import json
import asyncio
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException, Query, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse, StreamingResponse
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

try:
    # Prefer Prisma client for best-practice typed DB access when available
    from prisma import Prisma

    _prisma_available = True
except Exception:
    Prisma = None  # type: ignore
    _prisma_available = False

import asyncpg
from urllib.parse import urlsplit, urlunsplit, parse_qs
from dotenv import load_dotenv

# Load environment
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
PRODUCTS_TABLE = os.getenv("PRODUCTS_TABLE", "Product")
# Safely quote the table name for usage in SQL (handles capitalized names created by Prisma)
_pq = PRODUCTS_TABLE.replace('"', '""')
QUOTED_PRODUCTS_TABLE = f'"{_pq}"'

# Known top-level product columns we can edit directly (from your Prisma schema)
KNOWN_COLUMNS = {
    "title",
    "titleAr",
    "slug",
    "descriptionEn",
    "descriptionAr",
    "price",
    "compareAtPrice",
    "currency",
    "sku",
    "barcode",
    "isActive",
    "isFeatured",
    "isNew",
    "activeIngredients",
    "skinType",
    "concerns",
    "usage",
    "features",
    "featuresAr",
    "ingredients",
    "ingredientsAr",
    "howToUse",
    "howToUseAr",
    "metaTitle",
    "metaDescription",
    "stockQuantity",
    "categoryId",
    "brandId",
    "isTodayDeal",
}


def _quote_ident(name: str) -> str:
    """Return a safely quoted SQL identifier for Postgres."""
    return '"' + name.replace('"', '""') + '"'


app = FastAPI(title="Product Metadata Helper")
templates = Jinja2Templates(directory="templates")

pool: Optional[asyncpg.pool.Pool] = None
prisma: Optional["Prisma"] = None


class ProductOut(BaseModel):
    id: str
    title: Optional[str]
    fields: Optional[Dict[str, Any]]


class MetadataIn(BaseModel):
    metadata: Dict[str, Any]


# Progress Tracking System
class ProgressState:
    def __init__(self):
        self.jobs: Dict[str, Dict] = {}

    def create_job(self, job_id: str, total_items: int, description: str):
        self.jobs[job_id] = {
            "id": job_id,
            "status": "starting",
            "current": 0,
            "total": total_items,
            "description": description,
            "start_time": datetime.now(),
            "current_task": "Initializing...",
            "processed_items": [],
            "errors": [],
            "success_count": 0,
            "error_count": 0,
            "completed": False,
            "cancelled": False,
        }
        return self.jobs[job_id]

    def update_job(self, job_id: str, **kwargs):
        if job_id in self.jobs:
            # Map field names for consistency
            if "current_item" in kwargs:
                kwargs["current"] = kwargs.pop("current_item")
            if "status_message" in kwargs:
                kwargs["current_task"] = kwargs.pop("status_message")

            self.jobs[job_id].update(kwargs)

    def add_processed_item(self, job_id: str, item_info: Dict):
        if job_id in self.jobs:
            self.jobs[job_id]["processed_items"].append(item_info)
            if item_info.get("status") == "success":
                self.jobs[job_id]["success_count"] += 1
            elif item_info.get("status") == "error":
                self.jobs[job_id]["error_count"] += 1
                self.jobs[job_id]["errors"].append(item_info)

    def get_job(self, job_id: str):
        return self.jobs.get(job_id)

    def delete_job(self, job_id: str):
        if job_id in self.jobs:
            del self.jobs[job_id]


# Global progress tracker
progress_tracker = ProgressState()


@app.on_event("startup")
async def startup():
    global pool
    global prisma
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL not set in environment")

    print(f"🔗 Connecting to database...")
    print(f"DATABASE_URL: {DATABASE_URL[:50]}...")

    # asyncpg doesn't accept custom query params like `schema=` in the DSN used by some ORMs.
    # Parse the DATABASE_URL and remove the `schema` query param, but remember it so we can set
    # the Postgres search_path on each new connection.
    parts = urlsplit(DATABASE_URL)
    qs = parse_qs(parts.query)
    schema = None
    if "schema" in qs:
        schema = qs.get("schema", [None])[0]
        # Remove schema from query
        qs.pop("schema", None)
    # Rebuild the DSN without the schema query
    new_query = "".join([f"{k}={v[0]}&" for k, v in qs.items()])
    new_query = new_query.rstrip("&")
    cleaned = urlunsplit(
        (parts.scheme, parts.netloc, parts.path, new_query, parts.fragment)
    )

    async def _init_conn(conn):
        if schema:
            await conn.execute(f"SET search_path TO {schema}")

    # Start asyncpg pool as a fallback
    pool = await asyncpg.create_pool(dsn=cleaned, init=_init_conn)

    # Ensure the PRODUCTS_TABLE value maps to an actual table in the database.
    # Some ORMs (Prisma) create PascalCase table names like `Product` while an
    # env var may contain `products`. We'll try to detect the real table name and
    # update QUOTED_PRODUCTS_TABLE accordingly so raw SQL uses the correct identifier.
    global PRODUCTS_TABLE, QUOTED_PRODUCTS_TABLE
    try:
        async with pool.acquire() as conn:
            # Look for a table with the same name case-insensitively in the current schema
            found = await conn.fetchval(
                "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = current_schema() AND lower(tablename) = lower($1) LIMIT 1",
                PRODUCTS_TABLE,
            )
            if found:
                PRODUCTS_TABLE = found
                _pq = PRODUCTS_TABLE.replace('"', '""')
                QUOTED_PRODUCTS_TABLE = f'"{_pq}"'
            else:
                # Try a common Prisma fallback 'Product'
                found2 = await conn.fetchval(
                    "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = current_schema() AND tablename = $1 LIMIT 1",
                    "Product",
                )
                if found2:
                    PRODUCTS_TABLE = found2
                    _pq = PRODUCTS_TABLE.replace('"', '""')
                    QUOTED_PRODUCTS_TABLE = f'"{_pq}"'

            print(f"📊 Using table: {QUOTED_PRODUCTS_TABLE}")
            print(f"🔍 Schema: {schema or 'default'}")

    except Exception as e:
        print(f"⚠️ Table detection error: {e}")
        # If detection fails for any reason, leave the configured names as-is and rely
        # on earlier error handling (Prisma or asyncpg errors will surface later).
        pass

    # If Prisma is available, initialize it (Prisma will still use the same DATABASE_URL
    # but requires `prisma generate` to have been run in the repo). We keep asyncpg
    # as a fallback so the app remains runnable without the extra toolchain.
    if _prisma_available:
        try:
            prisma = Prisma()
            await prisma.connect()
            print("✅ Prisma connected successfully")
        except Exception as e:
            print(f"⚠️ Prisma connection failed: {e}")
            # if Prisma fails to connect, continue with asyncpg only
            prisma = None

    print(
        f"🚀 Startup complete. Using {'Prisma' if prisma else 'asyncpg'} for database access."
    )


@app.on_event("shutdown")
async def shutdown():
    global pool
    global prisma
    if pool:
        await pool.close()
    if prisma:
        try:
            await prisma.disconnect()
        except Exception:
            pass


# --- Database helper wrappers: use Prisma when available, otherwise asyncpg ---


def _to_dict_maybe(obj: Any) -> Dict[str, Any]:
    if obj is None:
        return {}
    if hasattr(obj, "dict"):
        return obj.dict()
    if isinstance(obj, dict):
        return obj
    try:
        return dict(obj)
    except Exception:
        return {k: getattr(obj, k) for k in dir(obj) if not k.startswith("_")}


async def db_find_missing_products(key_list: List[str], limit: int, offset: int = 0):
    """Return list of {id,title,fields} for products missing any of key_list.
    Tries Prisma first, falls back to asyncpg raw SQL."""
    # Prisma path
    if prisma:
        select = {k: True for k in key_list}
        select.update({"id": True, "title": True})
        or_clauses = []
        for k in key_list:
            or_clauses.append({k: None})
            or_clauses.append({k: ""})
        where = {"OR": or_clauses} if or_clauses else {}
        rows = await prisma.product.find_many(
            where=where, select=select, take=limit, skip=offset
        )
        out = []
        for r in rows:
            rd = _to_dict_maybe(r)
            fields = {k: rd.get(k) for k in key_list}
            out.append({"id": rd.get("id"), "title": rd.get("title"), "fields": fields})
        return out

    # asyncpg fallback
    async with pool.acquire() as conn:
        conds = [f"coalesce({_quote_ident(k)}::text,'') = ''" for k in key_list]
        where = " OR ".join(conds)
        cols = ", ".join(
            [_quote_ident("id"), _quote_ident("title")]
            + [_quote_ident(k) for k in key_list]
        )
        sql = f"SELECT {cols} FROM {QUOTED_PRODUCTS_TABLE} WHERE {where} LIMIT $1 OFFSET $2"
        rows = await conn.fetch(sql, limit, offset)
        products = []
        for r in rows:
            fields = {k: r.get(k) for k in key_list}
            products.append({"id": r["id"], "title": r.get("title"), "fields": fields})
        return products


async def db_count_missing_products(key_list: List[str]) -> int:
    """Count products missing any of key_list fields."""
    # Prisma path
    if prisma:
        or_clauses = []
        for k in key_list:
            or_clauses.append({k: None})
            or_clauses.append({k: ""})
        where = {"OR": or_clauses} if or_clauses else {}
        count = await prisma.product.count(where=where)
        return count

    # asyncpg fallback
    async with pool.acquire() as conn:
        conds = [f"coalesce({_quote_ident(k)}::text,'') = ''" for k in key_list]
        where = " OR ".join(conds)
        sql = f"SELECT COUNT(*) FROM {QUOTED_PRODUCTS_TABLE} WHERE {where}"
        result = await conn.fetchval(sql)
        return result or 0


async def db_fetch_product(product_id: str):
    """Return product dict or None."""
    if prisma:
        try:
            row = await prisma.product.find_unique(where={"id": product_id})
            return _to_dict_maybe(row)
        except Exception:
            return None
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            f"SELECT * FROM {QUOTED_PRODUCTS_TABLE} WHERE id = $1", product_id
        )
        return _to_dict_maybe(row) if row else None


async def db_update_product(product_id: str, updates: Dict[str, Any]):
    """Apply updates and return the updated row (dict) or None."""
    if prisma:
        try:
            row = await prisma.product.update(where={"id": product_id}, data=updates)
            return _to_dict_maybe(row)
        except Exception:
            return None
    # asyncpg path
    async with pool.acquire() as conn:
        set_parts = []
        args = []
        i = 1
        for col, val in updates.items():
            set_parts.append(f"{_quote_ident(col)} = ${i}")
            args.append(val)
            i += 1
        args.append(product_id)
        sql = f"UPDATE {QUOTED_PRODUCTS_TABLE} SET {', '.join(set_parts)} WHERE {_quote_ident('id')} = ${i} RETURNING *"
        row = await conn.fetchrow(sql, *args)
        return dict(row) if row else None


def _keys_list(keys_csv: Optional[str]) -> List[str]:
    if not keys_csv:
        return []
    return [k.strip() for k in keys_csv.split(",") if k.strip()]


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/progress/{job_id}")
async def get_progress(job_id: str):
    """Get the current progress of a job"""
    job = progress_tracker.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Calculate progress percentage
    progress_percent = (job["current"] / job["total"] * 100) if job["total"] > 0 else 0

    # Calculate estimated time remaining
    elapsed_time = (datetime.now() - job["start_time"]).total_seconds()
    if job["current"] > 0 and not job["completed"]:
        time_per_item = elapsed_time / job["current"]
        remaining_items = job["total"] - job["current"]
        eta_seconds = time_per_item * remaining_items
        eta_formatted = f"{int(eta_seconds // 60)}m {int(eta_seconds % 60)}s"
    else:
        eta_formatted = "Unknown"

    return {
        **job,
        "progress_percent": round(progress_percent, 1),
        "elapsed_time": f"{int(elapsed_time // 60)}m {int(elapsed_time % 60)}s",
        "eta": eta_formatted,
        "rate": (
            f"{job['current'] / (elapsed_time / 60):.1f}/min"
            if elapsed_time > 0
            else "0/min"
        ),
    }


@app.get("/progress/{job_id}/stream")
async def stream_progress(job_id: str):
    """Stream real-time progress updates using Server-Sent Events"""

    async def event_generator():
        while True:
            job = progress_tracker.get_job(job_id)
            if not job:
                yield f"data: {json.dumps({'error': 'Job not found'})}\n\n"
                break

            # Calculate additional metrics
            current_item = job.get("current", 0)
            total_items = job.get("total", 1)

            progress_percent = (
                (current_item / total_items * 100) if total_items > 0 else 0
            )
            elapsed_time = (datetime.now() - job["start_time"]).total_seconds()

            # Calculate ETA and rate
            if current_item > 0 and not job.get("completed", False):
                time_per_item = elapsed_time / current_item
                remaining_items = total_items - current_item
                eta_seconds = time_per_item * remaining_items
                rate_per_sec = current_item / elapsed_time if elapsed_time > 0 else 0
            else:
                eta_seconds = 0
                rate_per_sec = 0

            # Create response data with safe serialization
            progress_data = {
                "job_id": job_id,
                "status": job.get("status", "running"),
                "current_item": current_item,
                "total_items": total_items,
                "percentage": round(progress_percent, 1),
                "success_count": job.get("success_count", 0),
                "error_count": job.get("error_count", 0),
                "elapsed_time": elapsed_time,
                "eta": eta_seconds,
                "rate": rate_per_sec,
                "status_message": job.get("current_task", "Processing..."),
                "completed": job.get("completed", False),
                "cancelled": job.get("cancelled", False),
                "recent_items": job.get("processed_items", [])[-5:],  # Last 5 items
            }

            yield f"data: {json.dumps(progress_data)}\n\n"

            if job.get("completed", False) or job.get("cancelled", False):
                break

            await asyncio.sleep(1)  # Update every second

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        },
    )


@app.get("/debug/schema")
async def check_database_schema():
    """Debug endpoint to check the actual database table structure"""
    try:
        if pool:
            async with pool.acquire() as conn:
                # Get table structure
                query = """
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = $1
                ORDER BY ordinal_position;
                """
                rows = await conn.fetch(query, PRODUCTS_TABLE)

                columns = []
                metadata_exists = False

                for row in rows:
                    col_info = {
                        "column_name": row["column_name"],
                        "data_type": row["data_type"],
                        "is_nullable": row["is_nullable"],
                        "column_default": row["column_default"],
                    }
                    columns.append(col_info)

                    if row["column_name"] == "metadata":
                        metadata_exists = True

                # Check if metadata column has any data
                metadata_stats = None
                if metadata_exists:
                    try:
                        count_query = f"SELECT COUNT(*) as total, COUNT(metadata) as with_metadata FROM {QUOTED_PRODUCTS_TABLE}"
                        count_row = await conn.fetchrow(count_query)
                        metadata_stats = {
                            "total_products": count_row["total"],
                            "products_with_metadata": count_row["with_metadata"],
                        }
                    except Exception as e:
                        metadata_stats = {"error": str(e)}

                return {
                    "table_name": PRODUCTS_TABLE,
                    "total_columns": len(columns),
                    "metadata_column_exists": metadata_exists,
                    "metadata_stats": metadata_stats,
                    "columns": columns,
                    "known_columns": list(KNOWN_COLUMNS),
                }
        else:
            return {"error": "Database pool not available"}

    except Exception as e:
        return {"error": f"Failed to check schema: {str(e)}"}


@app.get("/", response_class=HTMLResponse)
async def ui_index(
    request: Request,
    keys: Optional[str] = Query(None),
    limit: int = 100,
    page: int = Query(1, ge=1),
):
    key_list = _keys_list(keys) or list(KNOWN_COLUMNS)
    # keep only known columns
    key_list = [k for k in key_list if k in KNOWN_COLUMNS]
    if not key_list:
        return templates.TemplateResponse(
            "index.html",
            {
                "request": request,
                "products": [],
                "keys": keys,
                "page": page,
                "limit": limit,
            },
        )

    # Calculate offset for pagination
    offset = (page - 1) * limit
    products = await db_find_missing_products(key_list, limit, offset)

    # Get total count for pagination info (more efficient count query)
    total_products = await db_count_missing_products(key_list)
    total_pages = (total_products + limit - 1) // limit  # Ceiling division

    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "products": products,
            "keys": keys,
            "page": page,
            "limit": limit,
            "total_products": total_products,
            "total_pages": total_pages,
            "has_prev": page > 1,
            "has_next": page < total_pages,
        },
    )


@app.get("/product/{product_id}", response_class=HTMLResponse)
async def ui_product(
    request: Request,
    product_id: str,
    keys: Optional[str] = Query(None),
    message: Optional[str] = Query(None),
):
    product = await db_fetch_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Handle status messages
    alert_message = None
    alert_type = None

    if message == "success":
        alert_message = "Product updated successfully!"
        alert_type = "success"
    elif message == "error":
        alert_message = "Error updating product. Please try again."
        alert_type = "danger"
    elif message == "no_changes":
        alert_message = "No changes were made."
        alert_type = "info"
    elif message == "autofill_committed":
        alert_message = "Autofill suggestions have been saved to the database!"
        alert_type = "success"
    elif message == "bulk_autofill_committed":
        alert_message = "🚀 All missing fields have been auto-generated and saved!"
        alert_type = "success"
    elif message == "suggestions_generated":
        alert_message = "AI suggestions generated! Review and save if desired."
        alert_type = "info"
    elif message == "bulk_suggestions_generated":
        alert_message = "🎯 All missing fields generated! Review and save if desired."
        alert_type = "info"

    # Extract suggestion parameters from query string
    suggestions = {}
    query_params = dict(request.query_params)
    for key, value in query_params.items():
        if key.startswith("suggest_"):
            field_name = key[8:]  # Remove "suggest_" prefix
            suggestions[field_name] = value

    return templates.TemplateResponse(
        "product.html",
        {
            "request": request,
            "product": product,
            "keys": keys,
            "alert_message": alert_message,
            "alert_type": alert_type,
            "suggestions": suggestions,
        },
    )


def _convert_field_value(field_name: str, value: Any) -> Any:
    """Convert form field values to appropriate types based on field name."""
    if value is None:
        return None

    # Handle string values
    if isinstance(value, str):
        value = value.strip()
        if value == "":
            return None

    # Numeric fields - float
    if field_name in ("price", "compareAtPrice"):
        try:
            return float(value) if value else None
        except (ValueError, TypeError):
            return None

    # Numeric fields - integer
    if field_name in ("stockQuantity", "viewCount", "salesCount"):
        try:
            return int(value) if value else None
        except (ValueError, TypeError):
            return None

    # Boolean fields
    if field_name in ("isActive", "isFeatured", "isNew", "isTodayDeal"):
        if isinstance(value, str):
            return value.lower() in ("true", "1", "yes", "on")
        return bool(value)

    # Default: return as string
    return value


@app.post("/product/{product_id}/patch")
async def ui_patch(request: Request, product_id: str):
    try:
        form = await request.form()
        # collect column updates from form (only known columns)
        col_updates = {}

        for k in KNOWN_COLUMNS:
            if k in form:
                converted_value = _convert_field_value(k, form.get(k))
                col_updates[k] = converted_value

        if not col_updates:
            # nothing to update
            return RedirectResponse(
                url=f"/product/{product_id}?message=no_changes", status_code=303
            )

        updated = await db_update_product(product_id, col_updates)
        if not updated:
            raise HTTPException(status_code=404, detail="Product not found")

        return RedirectResponse(
            url=f"/product/{product_id}?message=success", status_code=303
        )

    except Exception as e:
        # Log the error and redirect with error message
        print(f"Error updating product {product_id}: {e}")
        return RedirectResponse(
            url=f"/product/{product_id}?message=error", status_code=303
        )


@app.post("/product/{product_id}/autofill")
async def ui_autofill(
    product_id: str,
    keys: Optional[str] = Form(None),
    strategy: str = Form("both"),
    commit: Optional[str] = Form(None),
):
    # reuse autofill logic
    commit_flag = bool(commit)
    result = await autofill(
        product_id, keys=keys, strategy=strategy, commit=commit_flag
    )

    # If committed, redirect with success message
    if commit_flag:
        return RedirectResponse(
            url=f"/product/{product_id}?message=autofill_committed", status_code=303
        )

    # If not committed, redirect with suggestions as query parameters
    suggestions = result.get("suggestion", {})

    # Build query string with suggestions
    query_params = []
    for key, value in suggestions.items():
        if value and value != "unknown":
            # URL encode the value
            from urllib.parse import quote

            encoded_value = quote(str(value))
            query_params.append(f"suggest_{key}={encoded_value}")

    query_string = "&".join(query_params)
    redirect_url = f"/product/{product_id}?message=suggestions_generated"
    if query_string:
        redirect_url += f"&{query_string}"

    return RedirectResponse(url=redirect_url, status_code=303)


@app.get("/products/missing", response_model=List[ProductOut])
async def get_products_missing(
    keys: Optional[str] = Query(None, description="comma separated required fields"),
    limit: int = 100,
):
    key_list = _keys_list(keys) or list(KNOWN_COLUMNS)
    key_list = [k for k in key_list if k in KNOWN_COLUMNS]
    if not key_list:
        return []
    rows = await db_find_missing_products(key_list, limit)
    out = [
        ProductOut(id=r["id"], title=r.get("title"), fields=r.get("fields"))
        for r in rows
    ]
    return out


@app.post("/products/{product_id}/metadata")
async def update_metadata(product_id: str, payload: MetadataIn):
    """Update top-level fields from JSON payload (only KNOWN_COLUMNS allowed)."""
    updates = {k: v for k, v in payload.metadata.items() if k in KNOWN_COLUMNS}
    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields to update")
    row = await db_update_product(product_id, updates)
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"id": row.get("id"), "title": row.get("title")}


async def suggest_metadata_via_openai(
    product_name: Optional[str],
    existing_meta: Optional[Dict[str, Any]],
    required_keys: List[str],
) -> Dict[str, Any]:
    """
    Uses OpenAI to suggest metadata for skincare/cosmetic products.
    Provides comprehensive suggestions based on the complete product schema.
    """
    if not OPENAI_API_KEY:
        return {k: "" for k in required_keys}
    try:
        from openai import OpenAI

        client = OpenAI(api_key=OPENAI_API_KEY)

        # Enhanced prompt with schema context
        schema_context = """
        You are an expert in skincare and cosmetic products. Generate realistic, professional metadata for the following product.
        
        Field Guidelines:
        - title: Clear, SEO-friendly product name
        - titleAr: Arabic translation of the title
        - descriptionEn: Detailed English product description (2-3 sentences)
        - descriptionAr: Arabic translation of the description
        - activeIngredients: Key active ingredients (comma-separated)
        - skinType: Target skin type (e.g., "Oily", "Dry", "Combination", "Sensitive", "All")
        - concerns: Skin concerns addressed (e.g., "Acne, Aging, Hyperpigmentation")
        - usage: When/how often to use (e.g., "Morning and Evening", "Daily")
        - features: Key product benefits (comma-separated)
        - featuresAr: Arabic translation of features
        - ingredients: Full ingredient list (INCI format preferred)
        - ingredientsAr: Arabic translation of ingredients
        - howToUse: Step-by-step usage instructions
        - howToUseAr: Arabic translation of usage instructions
        - metaTitle: SEO title (50-60 characters)
        - metaDescription: SEO description (150-160 characters)
        - isFeatured: true if this is a premium/flagship product
        - isNew: true if this is a recently launched product
        - isTodayDeal: true if this should be featured in deals
        """

        message = f"""
        {schema_context}
        
        Product name: {product_name}
        Existing metadata: {json.dumps(existing_meta or {})}
        Required fields: {json.dumps(required_keys)}
        
        Return only a JSON object with the requested keys and suggested values. 
        Make suggestions realistic and professional for skincare/cosmetic products.
        For Arabic fields, provide proper Arabic translations.
        For boolean fields, use true/false.
        If unsure about a field, use "unknown" for text fields or false for booleans.
        """

        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": message}],
            max_tokens=800,  # Increased for more comprehensive responses
            temperature=0.3,  # Slightly more creative for better suggestions
        )
        text = resp.choices[0].message.content.strip()

        # Attempt to parse JSON from the response
        try:
            suggested = json.loads(text)
        except Exception:
            # Fallback: try to extract first JSON object within the text
            import re

            m = re.search(r"\{.*\}", text, re.S)
            if m:
                suggested = json.loads(m.group(0))
            else:
                suggested = {k: "unknown" for k in required_keys}
        return suggested
    except Exception as e:
        return {k: "" for k in required_keys}


async def search_online_for_metadata(
    product_name: Optional[str], required_keys: List[str]
) -> Dict[str, Any]:
    """
    Attempts a web search to find metadata. This is a minimal implementation using SerpAPI if SERPAPI_API_KEY is present.
    Otherwise returns empty suggestions. You can replace with your preferred search provider.
    """
    if not SERPAPI_API_KEY or not product_name:
        return {k: "" for k in required_keys}
    try:
        import httpx

        params = {
            "api_key": SERPAPI_API_KEY,
            "engine": "google",
            "q": product_name,
            "num": 3,
        }
        r = httpx.get("https://serpapi.com/search", params=params, timeout=10.0)
        data = r.json()
        # Naive extraction: look into organic_results snippets and try to find values
        text_pool = []
        for item in data.get("organic_results", [])[:3]:
            if "snippet" in item:
                text_pool.append(item["snippet"])
            if "title" in item:
                text_pool.append(item["title"])
        joined = "\n".join(text_pool)
        # Very naive heuristic: for each key, try to find a nearby word
        suggestions = {}
        for k in required_keys:
            # look for "k: value" pattern
            import re

            m = re.search(rf"{k}[:\s]+([A-Za-z0-9\-_,\s]+)", joined, re.I)
            if m:
                suggestions[k] = m.group(1).strip().strip(".,")
            else:
                suggestions[k] = ""
        return suggestions
    except Exception:
        return {k: "" for k in required_keys}


@app.post("/products/{product_id}/auto-fill")
async def autofill(
    product_id: str,
    keys: Optional[str] = Query(None, description="comma separated required keys"),
    strategy: str = "both",
    commit: bool = False,
):
    """
    Attempts to auto-fill missing metadata for the given product.
    strategy: one of 'llm', 'web', 'both'
    If commit=true, the suggested metadata will be merged into the product row.
    Returns the suggestion and (if committed) the updated metadata.
    """
    required_keys = _keys_list(keys)
    # fetch row using wrapper (Prisma or asyncpg)
    row = await db_fetch_product(product_id)
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    name = row.get("name") or row.get("title")
    # support both top-level metadata column (jsonb) or model fields
    existing_meta = row.get("metadata") or {}

    missing_keys = [
        k
        for k in required_keys
        if not (
            existing_meta
            and k in existing_meta
            and existing_meta[k] not in [None, "", []]
        )
    ]
    if not missing_keys:
        return {"status": "nothing_missing", "metadata": existing_meta}
    suggestion = {k: "" for k in missing_keys}
    if strategy in ("llm", "both"):
        llm_sugg = await suggest_metadata_via_openai(name, existing_meta, missing_keys)
        # Merge suggestions: prefer non-empty
        for k, v in llm_sugg.items():
            if v:
                suggestion[k] = v
    if strategy in ("web", "both"):
        web_sugg = await search_online_for_metadata(name, missing_keys)
        for k, v in web_sugg.items():
            if v and not suggestion.get(k):
                suggestion[k] = v

    # Normalize uncertain values to 'unknown'
    for k in missing_keys:
        val = suggestion.get(k) or ""
        if isinstance(val, str) and val.strip() == "":
            suggestion[k] = "unknown"

    result = {"suggestion": suggestion}
    if commit:
        # Update individual columns directly instead of metadata column
        if prisma:
            try:
                # Prepare data for individual column updates
                update_data = {}
                for key, value in suggestion.items():
                    if key in KNOWN_COLUMNS and value and value != "unknown":
                        # Convert types appropriately
                        if key in ["price", "compareAtPrice", "stockQuantity"]:
                            try:
                                update_data[key] = float(value) if value else None
                            except (ValueError, TypeError):
                                continue
                        elif key in ["isActive", "isFeatured", "isNew", "isTodayDeal"]:
                            update_data[key] = (
                                bool(value)
                                if isinstance(value, bool)
                                else str(value).lower() == "true"
                            )
                        else:
                            update_data[key] = str(value)

                if update_data:
                    updated = await prisma.product.update(
                        where={"id": product_id}, data=update_data
                    )
                    result["updated_fields"] = list(update_data.keys())
                    result["updated_data"] = update_data
                else:
                    result["message"] = "No valid fields to update"

            except Exception as e:
                print(f"Prisma commit error for product {product_id}: {str(e)}")
                print(f"Update data: {update_data}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to commit metadata via Prisma: {str(e)}",
                )
        else:
            # asyncpg path: update individual columns
            try:
                async with pool.acquire() as conn:
                    # Prepare update data for individual columns
                    update_data = {}
                    for key, value in suggestion.items():
                        if key in KNOWN_COLUMNS and value and value != "unknown":
                            # Convert types appropriately
                            if key in ["price", "compareAtPrice", "stockQuantity"]:
                                try:
                                    update_data[key] = float(value) if value else None
                                except (ValueError, TypeError):
                                    continue
                            elif key in [
                                "isActive",
                                "isFeatured",
                                "isNew",
                                "isTodayDeal",
                            ]:
                                update_data[key] = (
                                    bool(value)
                                    if isinstance(value, bool)
                                    else str(value).lower() == "true"
                                )
                            else:
                                update_data[key] = str(value)

                    if update_data:
                        # Build dynamic SQL for updating individual columns
                        set_clauses = []
                        params = []
                        param_num = 1

                        for col, val in update_data.items():
                            set_clauses.append(f"{_quote_ident(col)} = ${param_num}")
                            params.append(val)
                            param_num += 1

                        # Add product_id parameter
                        params.append(product_id)

                        sql = f"UPDATE {QUOTED_PRODUCTS_TABLE} SET {', '.join(set_clauses)} WHERE id = ${param_num} RETURNING id"
                        row = await conn.fetchrow(sql, *params)

                        result["updated_fields"] = list(update_data.keys())
                        result["updated_data"] = update_data
                    else:
                        result["message"] = "No valid fields to update"

            except Exception as e:
                print(f"SQL commit error for product {product_id}: {str(e)}")
                print(f"Update data: {update_data}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to commit metadata via SQL: {str(e)}",
                )
    return result


@app.post("/product/{product_id}/autofill/all")
async def autofill_all_missing(product_id: str, commit: bool = False):
    """
    Auto-generate ALL missing fields for a single product.
    This will identify all empty fields and generate comprehensive content.
    """
    # Get product data
    row = await db_fetch_product(product_id)
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")

    # Find all missing fields from the schema
    missing_fields = []
    for field in KNOWN_COLUMNS:
        if field in ["id", "createdAt", "updatedAt"]:  # Skip system fields
            continue

        field_value = row.get(field)
        # Consider field missing if it's None, empty string, or 0 for numeric fields
        if (
            field_value is None
            or (isinstance(field_value, str) and field_value.strip() == "")
            or (field in ["price", "stockQuantity"] and field_value == 0)
        ):
            missing_fields.append(field)

    if not missing_fields:
        return {
            "message": "No missing fields found",
            "fields_checked": len(KNOWN_COLUMNS),
        }

    # Generate content for all missing fields
    result = await autofill(
        product_id, keys=",".join(missing_fields), strategy="llm", commit=commit
    )

    result["total_fields_processed"] = len(missing_fields)
    result["missing_fields"] = missing_fields

    return result


@app.post("/products/bulk-autofill")
async def bulk_autofill_products(
    limit: int = 10,
    strategy: str = "llm",
    commit: bool = False,
    required_fields: Optional[str] = None,
    background: bool = False,
):
    """
    Bulk auto-generate content for multiple products.
    Processes products that have missing metadata and generates content for them.

    Args:
        limit: Maximum number of products to process
        strategy: Content generation strategy ('llm' or 'search')
        commit: Whether to save changes to database
        required_fields: Comma-separated list of specific fields to process
        background: If True, runs as background job and returns job_id
    """
    # Determine which fields to process
    if required_fields:
        fields_to_check = [
            f.strip() for f in required_fields.split(",") if f.strip() in KNOWN_COLUMNS
        ]
    else:
        # Default essential fields for bulk processing
        fields_to_check = [
            "descriptionEn",
            "descriptionAr",
            "activeIngredients",
            "skinType",
            "concerns",
            "features",
            "ingredients",
            "howToUse",
            "metaTitle",
            "metaDescription",
        ]

    # Get products with missing fields
    products_to_process = await db_find_missing_products(fields_to_check, limit)

    if not products_to_process:
        return {
            "message": "No products found with missing fields",
            "fields_checked": fields_to_check,
        }

    # If background processing requested, create job and return immediately
    if background:
        job_id = str(uuid.uuid4())
        progress_tracker.create_job(
            job_id=job_id,
            total_items=len(products_to_process),
            description=f"Bulk Autofill ({len(products_to_process)} products) - {strategy} strategy",
        )

        # Start background task
        asyncio.create_task(
            _process_bulk_autofill_background(
                job_id, products_to_process, fields_to_check, strategy, commit
            )
        )

        return {
            "message": "Background job started",
            "job_id": job_id,
            "total_products": len(products_to_process),
            "fields_checked": fields_to_check,
        }

    # Synchronous processing with simple progress tracking
    job_id = str(uuid.uuid4())
    progress_tracker.create_job(
        job_id=job_id,
        total_items=len(products_to_process),
        description=f"Bulk Autofill ({len(products_to_process)} products) - {strategy} strategy",
    )

    try:
        results = []
        processed_count = 0
        error_count = 0

        for i, product in enumerate(products_to_process):
            try:
                product_id = product["id"]
                product_title = product.get("title", "Unknown")
                missing_keys = product.get("fields", [])

                # Update progress
                progress_tracker.update_job(
                    job_id,
                    current_item=i + 1,
                    status_message=f"Processing: {product_title[:50]}...",
                )

                if missing_keys:
                    # Generate content for this product
                    result = await autofill(
                        product_id,
                        keys=",".join(missing_keys),
                        strategy=strategy,
                        commit=commit,
                    )

                    results.append(
                        {
                            "product_id": product_id,
                            "title": product_title,
                            "processed_fields": missing_keys,
                            "status": "success",
                            "suggestions": result.get("suggestion", {}),
                        }
                    )
                    processed_count += 1

                    # Add to processed items
                    progress_tracker.add_processed_item(
                        job_id,
                        {
                            "item_id": str(product_id),
                            "item_name": product_title,
                            "status": "success",
                            "details": f"Generated: {', '.join(missing_keys)}",
                        },
                    )

            except Exception as e:
                error_count += 1
                error_msg = str(e)

                results.append(
                    {
                        "product_id": product.get("id", "unknown"),
                        "title": product.get("title", "Unknown"),
                        "status": "error",
                        "error": error_msg,
                    }
                )

                # Add error to processed items
                progress_tracker.add_processed_item(
                    job_id,
                    {
                        "item_id": str(product.get("id", "unknown")),
                        "item_name": product.get("title", "Unknown"),
                        "status": "error",
                        "details": error_msg,
                    },
                )

                # Continue processing other products even if one fails
                continue

        # Mark job as completed
        progress_tracker.update_job(
            job_id,
            status="completed",
            status_message=f"Completed: {processed_count} successful, {error_count} errors",
        )

        return {
            "message": f"Bulk processing completed",
            "job_id": job_id,
            "total_products": len(products_to_process),
            "processed_successfully": processed_count,
            "errors": error_count,
            "committed": commit,
            "strategy_used": strategy,
            "fields_checked": fields_to_check,
            "results": results,
        }

    except Exception as e:
        # Mark job as failed
        progress_tracker.update_job(
            job_id, status="failed", status_message=f"Job failed: {str(e)}"
        )
        raise


async def _process_bulk_autofill_background(
    job_id: str,
    products_to_process: list,
    fields_to_check: list,
    strategy: str,
    commit: bool,
):
    """Background task for processing bulk autofill operations."""
    try:
        processed_count = 0
        error_count = 0

        for i, product in enumerate(products_to_process):
            try:
                product_id = product["id"]
                product_title = product.get("title", "Unknown")
                missing_keys = product.get("fields", [])

                # Update progress
                progress_tracker.update_job(
                    job_id,
                    current_item=i + 1,
                    status_message=f"Processing: {product_title[:50]}...",
                )

                if missing_keys:
                    # Generate content for this product
                    result = await autofill(
                        product_id,
                        keys=",".join(missing_keys),
                        strategy=strategy,
                        commit=commit,
                    )

                    processed_count += 1

                    # Add to processed items
                    progress_tracker.add_processed_item(
                        job_id,
                        {
                            "item_id": str(product_id),
                            "item_name": product_title,
                            "status": "success",
                            "details": f"Generated: {', '.join(missing_keys)}",
                        },
                    )

            except Exception as e:
                error_count += 1
                error_msg = str(e)

                # Add error to processed items
                progress_tracker.add_processed_item(
                    job_id,
                    {
                        "item_id": str(product.get("id", "unknown")),
                        "item_name": product.get("title", "Unknown"),
                        "status": "error",
                        "details": error_msg,
                    },
                )

                # Continue processing other products even if one fails
                continue

        # Mark job as completed
        progress_tracker.update_job(
            job_id,
            status="completed",
            status_message=f"Completed: {processed_count} successful, {error_count} errors",
        )

    except Exception as e:
        # Mark job as failed
        progress_tracker.update_job(
            job_id, status="failed", status_message=f"Background job failed: {str(e)}"
        )
    finally:
        # Clean up job after 1 hour
        await asyncio.sleep(3600)
        progress_tracker.delete_job(job_id)


@app.get("/products/missing-stats")
async def get_missing_stats():
    """
    Get statistics about missing fields across all products.
    Useful for understanding what content needs to be generated.
    """
    # Get sample of products to analyze
    products = await db_find_missing_products(list(KNOWN_COLUMNS), limit=1000)

    field_stats = {}
    total_products = len(products)

    # Initialize counters
    for field in KNOWN_COLUMNS:
        field_stats[field] = {"missing_count": 0, "completion_rate": 0}

    # Count missing fields
    for product in products:
        missing_fields = product.get("fields", [])
        for field in missing_fields:
            if field in field_stats:
                field_stats[field]["missing_count"] += 1

    # Calculate completion rates
    for field in field_stats:
        missing_count = field_stats[field]["missing_count"]
        field_stats[field]["completion_rate"] = round(
            (
                ((total_products - missing_count) / total_products * 100)
                if total_products > 0
                else 0
            ),
            1,
        )

    # Sort by completion rate (lowest first - highest priority)
    sorted_fields = sorted(field_stats.items(), key=lambda x: x[1]["completion_rate"])

    return {
        "total_products_analyzed": total_products,
        "field_statistics": dict(sorted_fields),
        "most_needed_fields": [
            field
            for field, stats in sorted_fields[:10]
            if stats["completion_rate"] < 50
        ],
        "summary": {
            "fields_below_50_percent": len(
                [f for f, s in field_stats.items() if s["completion_rate"] < 50]
            ),
            "fields_below_25_percent": len(
                [f for f, s in field_stats.items() if s["completion_rate"] < 25]
            ),
        },
    }
