"""
Product Recommendations Management Tools
Provides comprehensive tools for creating and managing product recommendations with Skinior.com integration.
"""

import logging
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime
import aiohttp
import json

logger = logging.getLogger(__name__)


class ProductRecommendationsManager:
    """
    Manages product recommendations with Skinior.com integration and personalized suggestions.
    """
    
    def __init__(self, backend_url: str = "http://localhost:4005"):
        self.backend_url = backend_url
        self.session = None
    
    async def __aenter__(self):
        """Async context manager entry."""
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self.session:
            await self.session.close()
    
    async def _make_request(self, method: str, endpoint: str, data: Dict = None) -> Dict:
        """Make HTTP request to backend API."""
        try:
            url = f"{self.backend_url}{endpoint}"
            headers = {"Content-Type": "application/json"}
            
            if method.upper() == "GET":
                async with self.session.get(url, headers=headers) as response:
                    return await response.json()
            elif method.upper() == "POST":
                async with self.session.post(url, json=data, headers=headers) as response:
                    return await response.json()
            elif method.upper() == "PUT":
                async with self.session.put(url, json=data, headers=headers) as response:
                    return await response.json()
            elif method.upper() == "DELETE":
                async with self.session.delete(url, headers=headers) as response:
                    return await response.json()
                    
        except Exception as e:
            logger.error(f"❌ API request failed: {e}")
            return {"error": str(e)}
    
    async def get_available_products(self, skin_type: str, concerns: List[str], budget_range: str = "all") -> List[Dict]:
        """
        Get available products from Skinior.com based on analysis criteria.
        
        Args:
            skin_type: User's skin type (oily, dry, combination, sensitive, normal)
            concerns: List of skin concerns (acne, aging, pigmentation, etc.)
            budget_range: Budget range (low, medium, high, all)
            
        Returns:
            List of available products
        """
        try:
            params = {
                "skin_type": skin_type,
                "concerns": concerns,
                "budget_range": budget_range,
                "source": "skinior.com",
                "availability": "in_stock"
            }
            
            endpoint = "/api/products/available"
            result = await self._make_request("GET", endpoint, params)
            
            if "error" not in result:
                products = result.get("products", [])
                logger.info(f"✅ Retrieved {len(products)} available products for {skin_type} skin")
                return products
            else:
                logger.error(f"❌ Failed to get available products: {result['error']}")
                return []
                
        except Exception as e:
            logger.error(f"❌ Error getting available products: {e}")
            return []
    
    async def create_product_recommendations(self, user_id: str, analysis_id: str, skin_analysis: Dict) -> List[Dict]:
        """
        Create personalized product recommendations based on skin analysis.
        
        Args:
            user_id: Unique user identifier
            analysis_id: Analysis session identifier
            skin_analysis: Skin analysis results
            
        Returns:
            List of product recommendations
        """
        try:
            skin_type = skin_analysis.get("skin_type", "normal")
            concerns = skin_analysis.get("concerns", [])
            budget_preference = skin_analysis.get("budget_preference", "medium")
            
            # Get available products
            available_products = await self.get_available_products(skin_type, concerns, budget_preference)
            
            # Create personalized recommendations
            recommendations = []
            for product in available_products:
                recommendation = {
                    "user_id": user_id,
                    "analysis_id": analysis_id,
                    "product_id": product["id"],
                    "product_name": product["name"],
                    "brand": product["brand"],
                    "category": product["category"],
                    "ingredients": product.get("ingredients", []),
                    "price": product["price"],
                    "currency": product.get("currency", "USD"),
                    "rating": product.get("rating", 0),
                    "review_count": product.get("review_count", 0),
                    "reason": f"Recommended for {skin_type} skin with {', '.join(concerns)} concerns",
                    "usage_instructions": product.get("usage_instructions", "Apply as directed"),
                    "priority": "high" if product.get("rating", 0) > 4.5 else "medium",
                    "availability": product.get("availability", True),
                    "skinior_url": product.get("url", ""),
                    "created_at": datetime.utcnow().isoformat()
                }
                recommendations.append(recommendation)
            
            # Save recommendations to database
            if recommendations:
                save_data = {
                    "user_id": user_id,
                    "analysis_id": analysis_id,
                    "recommendations": recommendations,
                    "skin_analysis": skin_analysis,
                    "created_at": datetime.utcnow().isoformat()
                }
                
                result = await self._make_request("POST", "/api/product-recommendations", save_data)
                
                if "error" not in result:
                    logger.info(f"✅ Created {len(recommendations)} product recommendations for user {user_id}")
                else:
                    logger.error(f"❌ Failed to save recommendations: {result['error']}")
            
            return recommendations
            
        except Exception as e:
            logger.error(f"❌ Error creating product recommendations: {e}")
            return []
    
    async def get_user_recommendations(self, user_id: str, limit: int = 10, offset: int = 0) -> List[Dict]:
        """
        Get user's product recommendations history.
        
        Args:
            user_id: Unique user identifier
            limit: Number of records to retrieve
            offset: Number of records to skip
            
        Returns:
            List of user recommendations
        """
        try:
            endpoint = f"/api/users/{user_id}/product-recommendations?limit={limit}&offset={offset}"
            result = await self._make_request("GET", endpoint)
            
            if "error" not in result:
                recommendations = result.get("recommendations", [])
                logger.info(f"✅ Retrieved {len(recommendations)} recommendations for user {user_id}")
                return recommendations
            else:
                logger.error(f"❌ Failed to get user recommendations: {result['error']}")
                return []
                
        except Exception as e:
            logger.error(f"❌ Error getting user recommendations: {e}")
            return []
    
    async def update_recommendation_status(self, recommendation_id: str, status: str, user_notes: str = "") -> Dict:
        """
        Update recommendation status (purchased, tried, not_interested, etc.).
        
        Args:
            recommendation_id: Recommendation identifier
            status: New status (purchased, tried, not_interested, wishlist)
            user_notes: User's notes about the recommendation
            
        Returns:
            Dict containing update result
        """
        try:
            update_data = {
                "status": status,
                "user_notes": user_notes,
                "updated_at": datetime.utcnow().isoformat()
            }
            
            result = await self._make_request("PUT", f"/api/product-recommendations/{recommendation_id}", update_data)
            
            if "error" not in result:
                logger.info(f"✅ Recommendation status updated: {recommendation_id} -> {status}")
                return result
            else:
                logger.error(f"❌ Failed to update recommendation status: {result['error']}")
                return result
                
        except Exception as e:
            logger.error(f"❌ Error updating recommendation status: {e}")
            return {"error": str(e)}
    
    async def get_product_details(self, product_id: str) -> Optional[Dict]:
        """
        Get detailed product information from Skinior.com.
        
        Args:
            product_id: Product identifier
            
        Returns:
            Product details or None if not found
        """
        try:
            endpoint = f"/api/products/{product_id}/details"
            result = await self._make_request("GET", endpoint)
            
            if "error" not in result:
                logger.info(f"✅ Retrieved product details: {product_id}")
                return result
            else:
                logger.error(f"❌ Failed to get product details: {result['error']}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error getting product details: {e}")
            return None
    
    async def search_products(self, query: str, filters: Dict = None) -> List[Dict]:
        """
        Search products on Skinior.com.
        
        Args:
            query: Search query
            filters: Additional filters (category, price_range, rating, etc.)
            
        Returns:
            List of matching products
        """
        try:
            search_data = {"query": query}
            if filters:
                search_data.update(filters)
            
            result = await self._make_request("POST", "/api/products/search", search_data)
            
            if "error" not in result:
                products = result.get("products", [])
                logger.info(f"✅ Found {len(products)} products for query: {query}")
                return products
            else:
                logger.error(f"❌ Failed to search products: {result['error']}")
                return []
                
        except Exception as e:
            logger.error(f"❌ Error searching products: {e}")
            return []
    
    async def get_recommendation_analytics(self, user_id: str) -> Dict:
        """
        Get analytics for user's product recommendations.
        
        Args:
            user_id: Unique user identifier
            
        Returns:
            Dict containing recommendation analytics
        """
        try:
            endpoint = f"/api/users/{user_id}/recommendation-analytics"
            result = await self._make_request("GET", endpoint)
            
            if "error" not in result:
                logger.info(f"✅ Retrieved recommendation analytics for user {user_id}")
                return result
            else:
                logger.error(f"❌ Failed to get recommendation analytics: {result['error']}")
                return {"error": result["error"]}
                
        except Exception as e:
            logger.error(f"❌ Error getting recommendation analytics: {e}")
            return {"error": str(e)}
    
    async def sync_skinior_products(self) -> Dict:
        """
        Sync products from Skinior.com to local database.
        
        Returns:
            Dict containing sync result
        """
        try:
            result = await self._make_request("POST", "/api/products/sync-skinior")
            
            if "error" not in result:
                logger.info("✅ Successfully synced products from Skinior.com")
                return result
            else:
                logger.error(f"❌ Failed to sync products: {result['error']}")
                return result
                
        except Exception as e:
            logger.error(f"❌ Error syncing products: {e}")
            return {"error": str(e)}


# Utility functions for easy access
async def get_available_products(skin_type: str, concerns: List[str], budget_range: str = "all") -> List[Dict]:
    """Get available products from Skinior.com."""
    async with ProductRecommendationsManager() as manager:
        return await manager.get_available_products(skin_type, concerns, budget_range)


async def create_product_recommendations(user_id: str, analysis_id: str, skin_analysis: Dict) -> List[Dict]:
    """Create personalized product recommendations."""
    async with ProductRecommendationsManager() as manager:
        return await manager.create_product_recommendations(user_id, analysis_id, skin_analysis)


async def get_user_recommendations(user_id: str, limit: int = 10, offset: int = 0) -> List[Dict]:
    """Get user's product recommendations."""
    async with ProductRecommendationsManager() as manager:
        return await manager.get_user_recommendations(user_id, limit, offset)


async def update_recommendation_status(recommendation_id: str, status: str, user_notes: str = "") -> Dict:
    """Update recommendation status."""
    async with ProductRecommendationsManager() as manager:
        return await manager.update_recommendation_status(recommendation_id, status, user_notes)


async def get_product_details(product_id: str) -> Optional[Dict]:
    """Get product details."""
    async with ProductRecommendationsManager() as manager:
        return await manager.get_product_details(product_id)


async def search_products(query: str, filters: Dict = None) -> List[Dict]:
    """Search products."""
    async with ProductRecommendationsManager() as manager:
        return await manager.search_products(query, filters)


async def get_recommendation_analytics(user_id: str) -> Dict:
    """Get recommendation analytics."""
    async with ProductRecommendationsManager() as manager:
        return await manager.get_recommendation_analytics(user_id)


async def sync_skinior_products() -> Dict:
    """Sync products from Skinior.com."""
    async with ProductRecommendationsManager() as manager:
        return await manager.sync_skinior_products()
