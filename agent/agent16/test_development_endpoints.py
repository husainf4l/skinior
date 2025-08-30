#!/usr/bin/env python3
"""
Development Endpoint Test for Agent16
Tests what endpoints are available on localhost:4008 and what needs to be implemented.
"""

import asyncio
import logging
import os
import sys
import aiohttp
from datetime import datetime
from dotenv import load_dotenv

# Add current directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

logger = logging.getLogger(__name__)

# Agent16 Authentication Credentials
AGENT16_AUTH_TOKEN = os.getenv("AGENT16_AUTH_TOKEN")
AGENT16_API_KEY = os.getenv("AGENT16_API_KEY")
BACKEND_URL = "http://localhost:4008"

print("🔬 Agent16 Development Endpoint Test")
print("Testing localhost:4008 for Agent16 endpoints")
print("=" * 60)


async def test_endpoint(method: str, endpoint: str, data: dict = None, description: str = ""):
    """Test a specific endpoint and return the result."""
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
                    result = await response.json() if response.status != 204 else {}
                    return {
                        "status": response.status,
                        "result": result,
                        "description": description
                    }
            elif method.upper() == "POST":
                async with session.post(url, json=data, headers=headers) as response:
                    result = await response.json() if response.status != 204 else {}
                    return {
                        "status": response.status,
                        "result": result,
                        "description": description
                    }
            elif method.upper() == "PUT":
                async with session.put(url, json=data, headers=headers) as response:
                    result = await response.json() if response.status != 204 else {}
                    return {
                        "status": response.status,
                        "result": result,
                        "description": description
                    }
            elif method.upper() == "DELETE":
                async with session.delete(url, headers=headers) as response:
                    result = await response.json() if response.status != 204 else {}
                    return {
                        "status": response.status,
                        "result": result,
                        "description": description
                    }
    except Exception as e:
        return {
            "status": "ERROR",
            "result": {"error": str(e)},
            "description": description
        }


async def test_all_endpoints():
    """Test all Agent16 endpoints and provide implementation status."""
    
    print("\n🔍 Testing Agent16 Required Endpoints")
    print("=" * 60)
    
    # Test data
    test_user_id = "test_user_123"
    test_session_id = f"test_session_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    test_analysis_id = test_session_id  # Use the actual session ID that gets created
    
    endpoints_to_test = [
        # Analysis Sessions
        {
            "method": "POST",
            "endpoint": "/api/analysis-sessions",
            "data": {
                "userId": test_user_id,
                "sessionId": test_session_id,
                "language": "english"
            },
            "description": "Create Analysis Session"
        },
        {
            "method": "GET",
            "endpoint": f"/api/analysis-sessions/{test_session_id}",
            "description": "Get Analysis Session"
        },
        {
            "method": "PUT",
            "endpoint": f"/api/analysis-sessions/{test_session_id}",
            "data": {
                "status": "completed"
            },
            "description": "Update Analysis Session"
        },
        {
            "method": "GET",
            "endpoint": f"/api/analysis-sessions/user/{test_user_id}",
            "description": "Get User Analysis Sessions"
        },
        
        # Analysis Data
        {
            "method": "POST",
            "endpoint": "/api/analysis-data",
            "data": {
                "userId": test_user_id,
                "analysisId": test_analysis_id,
                "analysisType": "skin_analysis",
                "data": {
                    "skin_type": "combination",
                    "concerns": ["acne", "aging"]
                }
            },
            "description": "Save Analysis Data"
        },
        {
            "method": "GET",
            "endpoint": f"/api/analysis-data/users/{test_user_id}/analysis-history",
            "description": "Get User Analysis History"
        },
        {
            "method": "GET",
            "endpoint": f"/api/analysis-data/users/{test_user_id}/progress-summary",
            "description": "Get User Progress Summary"
        },
        
        # Product Recommendations
        {
            "method": "POST",
            "endpoint": "/api/product-recommendations",
            "data": {
                "userId": test_user_id,
                "analysisId": test_analysis_id,
                "recommendations": [
                    {
                        "productId": "test_product_1",
                        "productName": "Test Product 1",
                        "brand": "Test Brand",
                        "category": "serum",
                        "price": 29.99,
                        "reason": "Recommended for combination skin"
                    }
                ]
            },
            "description": "Create Product Recommendations"
        },
        {
            "method": "GET",
            "endpoint": f"/api/product-recommendations/users/{test_user_id}",
            "description": "Get User Recommendations"
        },
        {
            "method": "PUT",
            "endpoint": "/api/product-recommendations/test_recommendation_123",
            "data": {
                "status": "purchased"
            },
            "description": "Update Recommendation Status"
        },
        {
            "method": "GET",
            "endpoint": f"/api/product-recommendations/users/{test_user_id}/analytics",
            "description": "Get Recommendation Analytics"
        },
        
        # Products
        {
            "method": "GET",
            "endpoint": "/api/products/available",
            "description": "Get Available Products"
        },
        {
            "method": "POST",
            "endpoint": "/api/products/search",
            "data": {
                "query": "hydrating serum"
            },
            "description": "Search Products"
        },
        {
            "method": "GET",
            "endpoint": "/api/products/test_product_123/details",
            "description": "Get Product Details"
        },
        {
            "method": "POST",
            "endpoint": "/api/products/sync-skinior",
            "data": {
                "products": [
                    {
                        "id": "test_prod_1",
                        "name": "Test Product",
                        "brand": "Test Brand"
                    }
                ],
                "syncTimestamp": datetime.now().isoformat()
            },
            "description": "Sync Skinior Products"
        },
        {
            "method": "GET",
            "endpoint": "/api/products/test_product_123/availability",
            "description": "Check Product Availability"
        }
    ]
    
    results = []
    
    for endpoint_test in endpoints_to_test:
        print(f"\n🔍 Testing: {endpoint_test['description']}")
        print(f"   {endpoint_test['method']} {endpoint_test['endpoint']}")
        
        result = await test_endpoint(
            method=endpoint_test['method'],
            endpoint=endpoint_test['endpoint'],
            data=endpoint_test.get('data'),
            description=endpoint_test['description']
        )
        
        status = result['status']
        if status == 200:
            print(f"   ✅ SUCCESS (200)")
        elif status == 201:
            print(f"   ✅ CREATED (201)")
        elif status == 404:
            print(f"   ❌ NOT IMPLEMENTED (404)")
            print(f"   📋 Response: {result['result']}")
        elif status == 401:
            print(f"   🔐 UNAUTHORIZED (401)")
            print(f"   📋 Response: {result['result']}")
        elif status == 403:
            print(f"   🚫 FORBIDDEN (403)")
            print(f"   📋 Response: {result['result']}")
        else:
            print(f"   ⚠️  UNEXPECTED ({status})")
            print(f"   📋 Response: {result['result']}")
        
        results.append({
            "endpoint": endpoint_test['endpoint'],
            "method": endpoint_test['method'],
            "description": endpoint_test['description'],
            "status": status,
            "result": result['result']
        })
    
    return results


async def generate_implementation_guide(results):
    """Generate an implementation guide based on test results."""
    
    print("\n" + "=" * 60)
    print("📋 AGENT16 BACKEND IMPLEMENTATION GUIDE")
    print("=" * 60)
    
    # Group by status
    not_implemented = [r for r in results if r['status'] == 404]
    unauthorized = [r for r in results if r['status'] == 401]
    forbidden = [r for r in results if r['status'] == 403]
    working = [r for r in results if r['status'] in [200, 201]]
    
    print(f"\n📊 Summary:")
    print(f"   ✅ Working: {len(working)} endpoints")
    print(f"   ❌ Not Implemented: {len(not_implemented)} endpoints")
    print(f"   🔐 Unauthorized: {len(unauthorized)} endpoints")
    print(f"   🚫 Forbidden: {len(forbidden)} endpoints")
    
    if not_implemented:
        print(f"\n🔧 ENDPOINTS TO IMPLEMENT:")
        print("=" * 40)
        
        for i, endpoint in enumerate(not_implemented, 1):
            print(f"\n{i}. {endpoint['description']}")
            print(f"   {endpoint['method']} {endpoint['endpoint']}")
            
            # Provide implementation hints
            if "analysis-sessions" in endpoint['endpoint']:
                print(f"   💡 Database table: analysis_sessions")
            elif "analysis-data" in endpoint['endpoint']:
                print(f"   💡 Database table: analysis_data")
            elif "product-recommendations" in endpoint['endpoint']:
                print(f"   💡 Database table: product_recommendations")
            elif "products" in endpoint['endpoint']:
                print(f"   💡 Database table: products")
    
    if unauthorized:
        print(f"\n🔐 AUTHENTICATION ISSUES:")
        print("=" * 40)
        for endpoint in unauthorized:
            print(f"   {endpoint['method']} {endpoint['endpoint']} - Check JWT token")
    
    if forbidden:
        print(f"\n🚫 AUTHORIZATION ISSUES:")
        print("=" * 40)
        for endpoint in forbidden:
            print(f"   {endpoint['method']} {endpoint['endpoint']} - Check API key permissions")
    
    if working:
        print(f"\n✅ WORKING ENDPOINTS:")
        print("=" * 40)
        for endpoint in working:
            print(f"   {endpoint['method']} {endpoint['endpoint']}")
    
    print(f"\n🔗 Backend URL: {BACKEND_URL}")
    print(f"🔐 Auth Token: {'✅ Loaded' if AGENT16_AUTH_TOKEN else '❌ Missing'}")
    print(f"🔑 API Key: {'✅ Loaded' if AGENT16_API_KEY else '❌ Missing'}")


async def main():
    """Run the development endpoint test."""
    
    # Test basic connectivity first
    print("🔍 Testing basic connectivity...")
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{BACKEND_URL}/api") as response:
                if response.status == 200:
                    result = await response.text()
                    print(f"✅ Backend is accessible: {result}")
                else:
                    print(f"❌ Backend returned status: {response.status}")
                    return False
    except Exception as e:
        print(f"❌ Failed to connect to backend: {e}")
        return False
    
    # Test all endpoints
    results = await test_all_endpoints()
    
    # Generate implementation guide
    await generate_implementation_guide(results)
    
    return True


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
