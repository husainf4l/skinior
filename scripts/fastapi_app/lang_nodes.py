"""
Lightweight "lang graph" node helper. This module provides helper functions that wire up two nodes:
- `suggest_with_llm` uses OpenAI (if OPENAI_API_KEY) or Gemini (if GOOGLE_API_KEY and google-generativeai installed)
- `search_web` uses SERPAPI (if SERPAPI_API_KEY)

It avoids hard runtime dependency on langgraph; if `langgraph` is installed, it registers nodes using the library's API.

Usage: import this module from `main.py` to ensure nodes are available when the app starts.
"""
import os
import json
from typing import Dict, List, Any, Optional

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

try:
    import langgraph
    HAS_LANGGRAPH = True
except Exception:
    HAS_LANGGRAPH = False


async def suggest_with_openai(product_name: Optional[str], existing_meta: Optional[Dict[str, Any]], required_keys: List[str]) -> Dict[str, Any]:
    if not OPENAI_API_KEY:
        return {k: "unknown" for k in required_keys}
    try:
        import openai
        openai.api_key = OPENAI_API_KEY
        message = (
            "You are a helpful assistant that fills missing product metadata.\n"
            f"Product name: {product_name}\n"
            f"Existing metadata: {json.dumps(existing_meta or {})}\n"
            f"Required keys: {json.dumps(required_keys)}\n"
            "Return only a JSON object with the requested keys and suggested values. If unsure use 'unknown'."
        )
        resp = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": message}],
            max_tokens=300,
            temperature=0.2,
        )
        text = resp["choices"][0]["message"]["content"].strip()
        return json.loads(text)
    except Exception:
        return {k: "unknown" for k in required_keys}


async def suggest_with_gemini(product_name: Optional[str], existing_meta: Optional[Dict[str, Any]], required_keys: List[str]) -> Dict[str, Any]:
    # Minimal Gemini example using google-generativeai
    if not GOOGLE_API_KEY:
        return {k: "unknown" for k in required_keys}
    try:
        import google.generativeai as genai
        genai.configure(api_key=GOOGLE_API_KEY)
        prompt = (
            "You are a helpful assistant that fills missing product metadata.\n"
            f"Product name: {product_name}\n"
            f"Existing metadata: {json.dumps(existing_meta or {})}\n"
            f"Required keys: {json.dumps(required_keys)}\n"
            "Return only a JSON object with the requested keys and suggested values. If unsure use 'unknown'."
        )
        resp = genai.chat.create(model="gpt-4o-mini", messages=[{"content": prompt}])
        text = resp.last or resp.candidates[0].content
        return json.loads(text)
    except Exception:
        return {k: "unknown" for k in required_keys}


async def search_web(product_name: Optional[str], required_keys: List[str]) -> Dict[str, Any]:
    if not SERPAPI_API_KEY or not product_name:
        return {k: "" for k in required_keys}
    try:
        import httpx
        params = {"api_key": SERPAPI_API_KEY, "engine": "google", "q": product_name, "num": 3}
        r = httpx.get("https://serpapi.com/search", params=params, timeout=10.0)
        data = r.json()
        text_pool = []
        for item in data.get("organic_results", [])[:3]:
            text_pool.append(item.get("title", ""))
            text_pool.append(item.get("snippet", ""))
        joined = "\n".join(text_pool)
        import re
        suggestions = {}
        for k in required_keys:
            m = re.search(rf"{k}[:\s]+([A-Za-z0-9\-_,\s]+)", joined, re.I)
            suggestions[k] = m.group(1).strip().strip(".,") if m else ""
        return suggestions
    except Exception:
        return {k: "" for k in required_keys}


# If langgraph is present, register wrapper nodes
if HAS_LANGGRAPH:
    try:
        # Example: register an async node that calls suggest_with_openai
        @langgraph.node("suggest_with_llm")
        async def suggest_with_llm_node(ctx, product_name: Optional[str], existing_meta: Optional[Dict[str, Any]], required_keys: List[str], provider: str = "openai"):
            if provider == "gemini":
                return await suggest_with_gemini(product_name, existing_meta, required_keys)
            return await suggest_with_openai(product_name, existing_meta, required_keys)

        @langgraph.node("search_web")
        async def search_web_node(ctx, product_name: Optional[str], required_keys: List[str]):
            return await search_web(product_name, required_keys)
    except Exception:
        # registration failed; skip silently
        pass
