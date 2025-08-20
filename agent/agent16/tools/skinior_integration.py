"""
Skinior.com Integration Tools
Provides comprehensive tools for integrating with Skinior.com and checking product availability.
"""

import logging
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime
import aiohttp
import json
import re

logger = logging.getLogger(__name__)


class SkiniorIntegrationManager:
    """
    Manages integration with Skinior.com for product availability and data synchronization.
    """
    
    def __init__(self, skinior_api_url: str = "https://api.skinior.com", backend_url: str = "http://localhost:4005"):
        self.skinior_api_url = skinior_api_url
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
    
    async def _make_skinior_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> Dict:
        """Make HTTP request to Skinior.com API."""
        try:
            url = f"{self.skinior_api_url}{endpoint}"
            default_headers = {
                "Content-Type": "application/json",
                "User-Agent": "Agent16-Skinior-Integration/1.0"
            }
            
            if headers:
                default_headers.update(headers)
            
            if method.upper() == "GET":
                async with self.session.get(url, headers=default_headers) as response:
                    return await response.json()
            elif method.upper() == "POST":
                async with self.session.post(url, json=data, headers=default_headers) as response:
                    return await response.json()
            elif method.upper() == "PUT":
                async with self.session.put(url, json=data, headers=default_headers) as response:
                    return await response.json()
                    
        except Exception as e:
            logger.error(f"❌ Skinior API request failed: {e}")
            return {"error": str(e)}
    
    async def _make_backend_request(self, method: str, endpoint: str, data: Dict = None) -> Dict:
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
                    
        except Exception as e:
            logger.error(f"❌ Backend API request failed: {e}")
            return {"error": str(e)}
    
    async def check_product_availability(self, product_id: str) -> Dict:
        """
        Check product availability on Skinior.com.
        
        Args:
            product_id: Product identifier on Skinior.com
            
        Returns:
            Dict containing availability information
        """
        try:
            endpoint = f"/products/{product_id}/availability"
            result = await self._make_skinior_request("GET", endpoint)
            
            if "error" not in result:
                availability_data = {
                    "product_id": product_id,
                    "available": result.get("available", False),
                    "stock_quantity": result.get("stock_quantity", 0),
                    "price": result.get("price", 0),
                    "currency": result.get("currency", "USD"),
                    "last_checked": datetime.utcnow().isoformat(),
                    "source": "skinior.com"
                }
                
                logger.info(f"✅ Product availability checked: {product_id} - Available: {availability_data['available']}")
                return availability_data
            else:
                logger.error(f"❌ Failed to check product availability: {result['error']}")
                return {"error": result["error"]}
                
        except Exception as e:
            logger.error(f"❌ Error checking product availability: {e}")
            return {"error": str(e)}
    
    async def get_skinior_products(self, filters: Dict = None) -> List[Dict]:
        """
        Get products from Skinior.com with optional filters.
        
        Args:
            filters: Optional filters (category, brand, price_range, etc.)
            
        Returns:
            List of products from Skinior.com
        """
        try:
            endpoint = "/products"
            if filters:
                # Convert filters to query parameters
                query_params = "&".join([f"{k}={v}" for k, v in filters.items()])
                endpoint = f"{endpoint}?{query_params}"
            
            result = await self._make_skinior_request("GET", endpoint)
            
            if "error" not in result:
                products = result.get("products", [])
                logger.info(f"✅ Retrieved {len(products)} products from Skinior.com")
                return products
            else:
                logger.error(f"❌ Failed to get Skinior products: {result['error']}")
                return []
                
        except Exception as e:
            logger.error(f"❌ Error getting Skinior products: {e}")
            return []
    
    async def search_skinior_products(self, query: str, filters: Dict = None) -> List[Dict]:
        """
        Search products on Skinior.com.
        
        Args:
            query: Search query
            filters: Additional filters
            
        Returns:
            List of matching products
        """
        try:
            search_data = {"query": query}
            if filters:
                search_data.update(filters)
            
            result = await self._make_skinior_request("POST", "/products/search", search_data)
            
            if "error" not in result:
                products = result.get("products", [])
                logger.info(f"✅ Found {len(products)} products on Skinior.com for query: {query}")
                return products
            else:
                logger.error(f"❌ Failed to search Skinior products: {result['error']}")
                return []
                
        except Exception as e:
            logger.error(f"❌ Error searching Skinior products: {e}")
            return []
    
    async def get_product_details_from_skinior(self, product_id: str) -> Optional[Dict]:
        """
        Get detailed product information from Skinior.com.
        
        Args:
            product_id: Product identifier
            
        Returns:
            Product details or None if not found
        """
        try:
            endpoint = f"/products/{product_id}"
            result = await self._make_skinior_request("GET", endpoint)
            
            if "error" not in result:
                # Normalize product data
                product_data = {
                    "id": result.get("id"),
                    "name": result.get("name"),
                    "brand": result.get("brand"),
                    "category": result.get("category"),
                    "description": result.get("description"),
                    "ingredients": result.get("ingredients", []),
                    "price": result.get("price"),
                    "currency": result.get("currency", "USD"),
                    "rating": result.get("rating", 0),
                    "review_count": result.get("review_count", 0),
                    "availability": result.get("availability", False),
                    "stock_quantity": result.get("stock_quantity", 0),
                    "images": result.get("images", []),
                    "url": result.get("url", ""),
                    "sku": result.get("sku"),
                    "weight": result.get("weight"),
                    "dimensions": result.get("dimensions"),
                    "tags": result.get("tags", []),
                    "skin_type": result.get("skin_type", []),
                    "concerns": result.get("concerns", []),
                    "usage_instructions": result.get("usage_instructions", ""),
                    "warnings": result.get("warnings", []),
                    "last_updated": datetime.utcnow().isoformat(),
                    "source": "skinior.com"
                }
                
                logger.info(f"✅ Retrieved product details from Skinior.com: {product_id}")
                return product_data
            else:
                logger.error(f"❌ Failed to get product details from Skinior.com: {result['error']}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error getting product details from Skinior.com: {e}")
            return None
    
    async def sync_products_to_backend(self, products: List[Dict]) -> Dict:
        """
        Sync products from Skinior.com to backend database.
        
        Args:
            products: List of products to sync
            
        Returns:
            Dict containing sync result
        """
        try:
            sync_data = {
                "products": products,
                "source": "skinior.com",
                "sync_timestamp": datetime.utcnow().isoformat()
            }
            
            result = await self._make_backend_request("POST", "/api/products/sync-skinior", sync_data)
            
            if "error" not in result:
                logger.info(f"✅ Successfully synced {len(products)} products to backend")
                return result
            else:
                logger.error(f"❌ Failed to sync products to backend: {result['error']}")
                return result
                
        except Exception as e:
            logger.error(f"❌ Error syncing products to backend: {e}")
            return {"error": str(e)}
    
    async def update_product_availability(self, product_id: str) -> Dict:
        """
        Update product availability in backend database.
        
        Args:
            product_id: Product identifier
            
        Returns:
            Dict containing update result
        """
        try:
            # Check availability on Skinior.com
            availability = await self.check_product_availability(product_id)
            
            if "error" not in availability:
                # Update in backend
                update_data = {
                    "product_id": product_id,
                    "availability": availability,
                    "updated_at": datetime.utcnow().isoformat()
                }
                
                result = await self._make_backend_request("PUT", f"/api/products/{product_id}/availability", update_data)
                
                if "error" not in result:
                    logger.info(f"✅ Updated product availability: {product_id}")
                    return result
                else:
                    logger.error(f"❌ Failed to update product availability: {result['error']}")
                    return result
            else:
                return availability
                
        except Exception as e:
            logger.error(f"❌ Error updating product availability: {e}")
            return {"error": str(e)}
    
    async def get_skinior_categories(self) -> List[Dict]:
        """
        Get product categories from Skinior.com.
        
        Returns:
            List of product categories
        """
        try:
            endpoint = "/categories"
            result = await self._make_skinior_request("GET", endpoint)
            
            if "error" not in result:
                categories = result.get("categories", [])
                logger.info(f"✅ Retrieved {len(categories)} categories from Skinior.com")
                return categories
            else:
                logger.error(f"❌ Failed to get Skinior categories: {result['error']}")
                return []
                
        except Exception as e:
            logger.error(f"❌ Error getting Skinior categories: {e}")
            return []
    
    async def get_skinior_brands(self) -> List[Dict]:
        """
        Get product brands from Skinior.com.
        
        Returns:
            List of product brands
        """
        try:
            endpoint = "/brands"
            result = await self._make_skinior_request("GET", endpoint)
            
            if "error" not in result:
                brands = result.get("brands", [])
                logger.info(f"✅ Retrieved {len(brands)} brands from Skinior.com")
                return brands
            else:
                logger.error(f"❌ Failed to get Skinior brands: {result['error']}")
                return []
                
        except Exception as e:
            logger.error(f"❌ Error getting Skinior brands: {e}")
            return []
    
    async def validate_skinior_url(self, url: str) -> Dict:
        """
        Validate if a URL is from Skinior.com and extract product information.
        
        Args:
            url: URL to validate
            
        Returns:
            Dict containing validation result and product info
        """
        try:
            # Check if URL is from Skinior.com
            skinior_pattern = r"https?://(?:www\.)?skinior\.com/(?:product|p)/([^/?]+)"
            match = re.match(skinior_pattern, url)
            
            if match:
                product_slug = match.group(1)
                validation_result = {
                    "is_valid": True,
                    "is_skinior": True,
                    "product_slug": product_slug,
                    "url": url,
                    "validated_at": datetime.utcnow().isoformat()
                }
                
                # Try to get product details
                try:
                    product_details = await self.get_product_details_from_skinior(product_slug)
                    if product_details:
                        validation_result["product_details"] = product_details
                except Exception:
                    pass
                
                logger.info(f"✅ Validated Skinior.com URL: {url}")
                return validation_result
            else:
                validation_result = {
                    "is_valid": False,
                    "is_skinior": False,
                    "url": url,
                    "validated_at": datetime.utcnow().isoformat()
                }
                
                logger.warning(f"⚠️ Invalid Skinior.com URL: {url}")
                return validation_result
                
        except Exception as e:
            logger.error(f"❌ Error validating Skinior URL: {e}")
            return {"error": str(e)}


# Utility functions for easy access
async def check_product_availability(product_id: str) -> Dict:
    """Check product availability on Skinior.com."""
    async with SkiniorIntegrationManager() as manager:
        return await manager.check_product_availability(product_id)


async def get_skinior_products(filters: Dict = None) -> List[Dict]:
    """Get products from Skinior.com."""
    async with SkiniorIntegrationManager() as manager:
        return await manager.get_skinior_products(filters)


async def search_skinior_products(query: str, filters: Dict = None) -> List[Dict]:
    """Search products on Skinior.com."""
    async with SkiniorIntegrationManager() as manager:
        return await manager.search_skinior_products(query, filters)


async def get_product_details_from_skinior(product_id: str) -> Optional[Dict]:
    """Get product details from Skinior.com."""
    async with SkiniorIntegrationManager() as manager:
        return await manager.get_product_details_from_skinior(product_id)


async def sync_products_to_backend(products: List[Dict]) -> Dict:
    """Sync products to backend database."""
    async with SkiniorIntegrationManager() as manager:
        return await manager.sync_products_to_backend(products)


async def update_product_availability(product_id: str) -> Dict:
    """Update product availability."""
    async with SkiniorIntegrationManager() as manager:
        return await manager.update_product_availability(product_id)


async def get_skinior_categories() -> List[Dict]:
    """Get categories from Skinior.com."""
    async with SkiniorIntegrationManager() as manager:
        return await manager.get_skinior_categories()


async def get_skinior_brands() -> List[Dict]:
    """Get brands from Skinior.com."""
    async with SkiniorIntegrationManager() as manager:
        return await manager.get_skinior_brands()


async def validate_skinior_url(url: str) -> Dict:
    """Validate Skinior.com URL."""
    async with SkiniorIntegrationManager() as manager:
        return await manager.validate_skinior_url(url)
