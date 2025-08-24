Product Metadata Helper - FastAPI template

Overview

This small FastAPI service scans a Postgres database for products missing metadata, suggests metadata using an LLM or web search, and can commit suggested metadata back to the database.

Files

- `main.py` - FastAPI application.
- `requirements.txt` - Python dependencies.
- `.env.example` - example environment variables.

Environment

Create a `.env` in the same folder (or export env vars). Minimal variables:

- DATABASE_URL - Postgres connection string (your provided DATABASE_URL fits this)
- PRODUCTS_TABLE - optional, defaults to `products`
- OPENAI_API_KEY - optional, to enable OpenAI suggestions
- SERPAPI_API_KEY - optional, to enable simple web search via SerpAPI

Endpoints

- GET /health
- GET /products/missing?keys=key1,key2&limit=100 - returns products missing any of the listed keys. If keys omitted, finds rows where metadata is NULL or empty.
- POST /products/{id}/metadata - body: {"metadata": {..}} - merges provided metadata into the product.
- POST /products/{id}/auto-fill?keys=key1,key2&strategy=both|llm|web&commit=false - returns suggested metadata. If commit=true, merges it.

How to run

1. Create and activate a virtualenv (macOS zsh):

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Copy `.env.example` -> `.env` and fill `DATABASE_URL`.

3. Start the app:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Notes & Next steps

- The OpenAI and web-search integrations are minimal examples. Fill `OPENAI_API_KEY` and/or `SERPAPI_API_KEY` to enable them.
- You may want to adapt SQL to match your actual `products` table schema (column names/types). The template expects columns: `id`, `name`, `metadata` (jsonb).
- Add authentication and rate limiting before running in production.
