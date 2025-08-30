#!/usr/bin/env python3
"""
Quick Backend Status Check
Tests what endpoints are actually available on localhost:4008
"""

import asyncio
import aiohttp
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

AGENT16_AUTH_TOKEN = os.getenv("AGENT16_AUTH_TOKEN")
AGENT16_API_KEY = os.getenv("AGENT16_API_KEY")
BACKEND_URL = "http://localhost:4008"

print("🔍 Quick Backend Status Check")
print("=" * 50)

async def test_endpoint(method: str, endpoint: str, description: str = ""):
    """Test a single endpoint."""
    url = f"{BACKEND_URL}{endpoint}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AGENT16_AUTH_TOKEN}",
        "x-api-key": AGENT16_API_KEY
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            if method.upper() == "GET":
                async with session.get(url, headers=headers) as response:
                    result = await response.text()
                    return {
                        "status": response.status,
                        "result": result,
                        "description": description
                    }
            elif method.upper() == "POST":
                async with session.post(url, headers=headers) as response:
                    result = await response.text()
                    return {
                        "status": response.status,
                        "result": result,
                        "description": description
                    }
    except Exception as e:
        return {
            "status": "ERROR",
            "result": str(e),
            "description": description
        }

async def main():
    """Test basic endpoints to see what's available."""
    
    # Test basic connectivity
    print("🔍 Testing basic connectivity...")
    basic_result = await test_endpoint("GET", "/api", "Basic API")
    print(f"   Status: {basic_result['status']}")
    print(f"   Response: {basic_result['result']}")
    print()
    
    # Test some common endpoints that might exist
    test_endpoints = [
        ("GET", "/api/health", "Health Check"),
        ("GET", "/api/status", "Status Check"),
        ("GET", "/api/v1", "API v1"),
        ("GET", "/api/v1/health", "API v1 Health"),
        ("GET", "/health", "Health"),
        ("GET", "/status", "Status"),
        ("GET", "/", "Root"),
    ]
    
    print("🔍 Testing common endpoint patterns...")
    for method, endpoint, description in test_endpoints:
        result = await test_endpoint(method, endpoint, description)
        print(f"   {method} {endpoint}: {result['status']} - {result['result'][:100]}")
    
    print()
    print("🔍 Testing Agent16 specific endpoints...")
    
    # Test Agent16 endpoints
    agent16_endpoints = [
        ("GET", "/api/analysis-sessions", "Analysis Sessions List"),
        ("POST", "/api/analysis-sessions", "Create Analysis Session"),
        ("GET", "/api/analysis-data", "Analysis Data List"),
        ("POST", "/api/analysis-data", "Create Analysis Data"),
        ("GET", "/api/product-recommendations", "Product Recommendations List"),
        ("POST", "/api/product-recommendations", "Create Product Recommendations"),
        ("GET", "/api/products", "Products List"),
        ("GET", "/api/products/available", "Available Products"),
    ]
    
    for method, endpoint, description in agent16_endpoints:
        result = await test_endpoint(method, endpoint, description)
        print(f"   {method} {endpoint}: {result['status']} - {result['result'][:100]}")
    
    print()
    print("📋 Summary:")
    print("   - If you see 404 errors, the endpoints are not implemented yet")
    print("   - If you see 401 errors, authentication is working but endpoints exist")
    print("   - If you see 200/201 responses, endpoints are working!")
    print()
    print("🔗 Backend URL:", BACKEND_URL)
    print("🔐 Auth Token:", "✅ Loaded" if AGENT16_AUTH_TOKEN else "❌ Missing")
    print("🔑 API Key:", "✅ Loaded" if AGENT16_API_KEY else "❌ Missing")

if __name__ == "__main__":
    asyncio.run(main())
