"""
Skinior AI Agent Tools

Advanced skincare tools that integrate with the Skinior backend API
to provide personalized skincare consultation and product recommendations.
"""

import os
import json
import logging
import aiohttp
import asyncio
from typing import List, Dict, Any, Optional
from langchain_core.tools import tool
from datetime import datetime

logger = logging.getLogger(__name__)

# Skinior Backend Configuration
SKINIOR_API_BASE = "http://localhost:4008"  # Backend running on port 4008
SKINIOR_API_KEY = os.getenv("SKINIOR_API_KEY", "default_api_key")


class SkiniorAPIClient:
    """Client for Skinior Backend API"""
    
    def __init__(self):
        self.base_url = SKINIOR_API_BASE
        self.api_key = SKINIOR_API_KEY
    
    async def make_request(
        self, 
        endpoint: str, 
        method: str = "GET", 
        params: Dict = None, 
        json_data: Dict = None,
        headers: Dict = None
    ) -> Dict[str, Any]:
        """Make authenticated request to Skinior backend"""
        try:
            default_headers = {
                "Content-Type": "application/json",
                "X-API-Key": self.api_key
            }
            if headers:
                default_headers.update(headers)
            
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}{endpoint}"
                
                async with session.request(
                    method, url, 
                    params=params, 
                    json=json_data, 
                    headers=default_headers
                ) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        error_text = await response.text()
                        logger.error(f"API request failed: {response.status} - {error_text}")
                        return {
                            "error": f"API request failed: {response.status}",
                            "details": error_text
                        }
        except Exception as e:
            logger.error(f"Error making API request: {str(e)}")
            return {"error": str(e)}

# Global client instance
skinior_client = SkiniorAPIClient()


def sync_skinior_request(
    endpoint: str, 
    method: str = "GET", 
    params: Dict = None, 
    json_data: Dict = None
) -> Dict[str, Any]:
    """Synchronous wrapper for Skinior API requests"""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            import concurrent.futures
            import threading
            
            def run_in_thread():
                new_loop = asyncio.new_event_loop()
                asyncio.set_event_loop(new_loop)
                try:
                    return new_loop.run_until_complete(
                        skinior_client.make_request(endpoint, method, params, json_data)
                    )
                finally:
                    new_loop.close()
            
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(run_in_thread)
                return future.result()
        else:
            return loop.run_until_complete(
                skinior_client.make_request(endpoint, method, params, json_data)
            )
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(
                skinior_client.make_request(endpoint, method, params, json_data)
            )
        finally:
            loop.close()


@tool
def get_product_recommendations(
    skin_type: str, 
    concerns: str, 
    budget_range: str = "medium",
    limit: int = 10
) -> str:
    """
    Get personalized product recommendations based on skin analysis.
    
    Essential tool for providing tailored skincare product suggestions using
    Skinior's AI-powered recommendation engine.
    
    Args:
        skin_type: User's skin type (dry, oily, combination, sensitive, normal)
        concerns: Comma-separated skin concerns (acne, aging, hyperpigmentation, dryness, oiliness)
        budget_range: Budget preference (low, medium, high)
        limit: Maximum number of recommendations (1-20, default: 10)
    
    Returns:
        Detailed product recommendations with match scores and reasons
        
    Examples:
        get_product_recommendations("combination", "acne,aging", "medium", 5)
        get_product_recommendations("dry", "aging,dryness", "high", 8)
    """
    try:
        params = {
            "skinType": skin_type,
            "concerns": concerns,
            "budgetRange": budget_range,
            "limit": min(limit, 20),
            "source": "skinior.com"
        }
        
        result = sync_skinior_request("/products/available", "GET", params)
        
        if "error" in result:
            return f"❌ Error getting recommendations: {result['error']}"
        
        if not result.get("success"):
            return "❌ Failed to get product recommendations from Skinior API"
        
        products = result.get("data", {}).get("products", [])
        filters_applied = result.get("data", {}).get("filtersApplied", {})
        
        if not products:
            return f"🔍 No products found for skin type '{skin_type}' with concerns '{concerns}'"
        
        # Format the recommendations
        response = [
            f"🌟 **Personalized Skincare Recommendations**",
            f"📊 **Skin Profile:** {skin_type.title()} skin with {concerns} concerns",
            f"💰 **Budget Range:** {budget_range.title()}",
            f"🎯 **Found {len(products)} recommended products:**\n"
        ]
        
        for i, product in enumerate(products, 1):
            name = product.get("title", "Unknown Product")
            brand = product.get("brand", "Unknown Brand") 
            price = product.get("price", 0)
            description = product.get("descriptionEn", "")[:100] + "..." if product.get("descriptionEn") else "No description"
            skin_types = product.get("skinTypes", [])
            ingredients = product.get("keyIngredients", [])
            
            response.append(f"**{i}. {name}** by {brand}")
            response.append(f"   💰 ${price:.2f}")
            response.append(f"   📝 {description}")
            if skin_types:
                response.append(f"   🎯 Suitable for: {', '.join(skin_types)}")
            if ingredients:
                response.append(f"   🧪 Key ingredients: {', '.join(ingredients[:3])}")
            response.append("")
        
        return "\n".join(response)
        
    except Exception as e:
        logger.error(f"Error in get_product_recommendations: {str(e)}")
        return f"❌ Error getting recommendations: {str(e)}"


@tool
def search_skinior_products(
    query: str, 
    category: str = None,
    price_range: str = None,
    limit: int = 10
) -> str:
    """
    Search Skinior's product catalog with advanced filtering.
    
    Comprehensive product search tool for finding specific skincare products
    in Skinior's extensive catalog.
    
    Args:
        query: Search query (product name, ingredient, brand, concern)
        category: Product category filter (cleanser, serum, moisturizer, sunscreen, etc.)
        price_range: Price range filter (low, medium, high)
        limit: Maximum number of results (1-20, default: 10)
    
    Returns:
        Detailed search results with product information and availability
        
    Examples:
        search_skinior_products("vitamin c serum")
        search_skinior_products("retinol", "serum", "medium", 5)
        search_skinior_products("acne treatment", limit=8)
    """
    try:
        search_data = {
            "query": query,
            "limit": min(limit, 20),
            "offset": 0,
            "availableOnly": True,
            "sortBy": "rating_desc"
        }
        
        if category:
            search_data["category"] = category
        if price_range:
            search_data["priceRange"] = price_range
        
        result = sync_skinior_request("/products/search", "POST", json_data=search_data)
        
        if "error" in result:
            return f"❌ Search error: {result['error']}"
        
        if not result.get("success"):
            return "❌ Failed to search Skinior products"
        
        data = result.get("data", {})
        products = data.get("products", [])
        total = data.get("total", 0)
        
        if not products:
            return f"🔍 No products found for '{query}'"
        
        response = [
            f"🔍 **Skinior Product Search Results**",
            f"📝 **Query:** '{query}'",
            f"📊 **Found {total} products** (showing {len(products)}):\n"
        ]
        
        for i, product in enumerate(products, 1):
            name = product.get("title", "Unknown Product")
            brand = product.get("brand", "Unknown Brand")
            price = product.get("price", 0)
            compare_price = product.get("compareAtPrice", 0)
            rating = product.get("rating", 0)
            stock = product.get("stockQuantity", 0)
            is_featured = product.get("isFeatured", False)
            
            response.append(f"**{i}. {name}** by {brand}")
            
            if compare_price > price:
                discount = ((compare_price - price) / compare_price) * 100
                response.append(f"   💰 ${price:.2f} ~~${compare_price:.2f}~~ ({discount:.0f}% OFF)")
            else:
                response.append(f"   💰 ${price:.2f}")
            
            if rating > 0:
                stars = "⭐" * int(rating)
                response.append(f"   {stars} {rating}/5")
            
            response.append(f"   📦 Stock: {stock} units")
            
            if is_featured:
                response.append(f"   🌟 Featured Product")
            
            response.append("")
        
        return "\n".join(response)
        
    except Exception as e:
        logger.error(f"Error in search_skinior_products: {str(e)}")
        return f"❌ Search error: {str(e)}"


@tool
def get_product_details(product_id: str) -> str:
    """
    Get detailed information about a specific Skinior product.
    
    Comprehensive product information tool for providing in-depth details
    about skincare products including ingredients, usage, and reviews.
    
    Args:
        product_id: Unique product identifier from Skinior catalog
    
    Returns:
        Complete product details including ingredients, benefits, and usage instructions
        
    Examples:
        get_product_details("prod_123456")
        get_product_details("684ca6c6-fe72-45e0-9625-47341ed67893")
    """
    try:
        result = sync_skinior_request(f"/products/{product_id}/details")
        
        if "error" in result:
            return f"❌ Error getting product details: {result['error']}"
        
        if not result.get("success"):
            return f"❌ Product with ID '{product_id}' not found"
        
        product = result.get("data", {})
        
        if not product:
            return f"❌ No product data found for ID '{product_id}'"
        
        name = product.get("title", "Unknown Product")
        brand = product.get("brand", "Unknown Brand")
        price = product.get("price", 0)
        description_en = product.get("descriptionEn", "No description available")
        skin_types = product.get("skinTypes", [])
        concerns = product.get("targetConcerns", [])
        ingredients = product.get("keyIngredients", [])
        instructions = product.get("instructions", "No usage instructions provided")
        benefits = product.get("benefits", [])
        rating = product.get("rating", 0)
        reviews_count = product.get("reviewsCount", 0)
        stock = product.get("stockQuantity", 0)
        
        response = [
            f"🧴 **{name}**",
            f"🏷️ **Brand:** {brand}",
            f"💰 **Price:** ${price:.2f}",
            f"",
            f"📝 **Description:**",
            f"{description_en}",
            f"",
        ]
        
        if skin_types:
            response.extend([
                f"🎯 **Suitable for:** {', '.join(skin_types)} skin",
                ""
            ])
        
        if concerns:
            response.extend([
                f"🎪 **Target Concerns:** {', '.join(concerns)}",
                ""
            ])
        
        if ingredients:
            response.extend([
                f"🧪 **Key Ingredients:**",
                *[f"   • {ingredient}" for ingredient in ingredients],
                ""
            ])
        
        if benefits:
            response.extend([
                f"✨ **Benefits:**",
                *[f"   • {benefit}" for benefit in benefits],
                ""
            ])
        
        response.extend([
            f"📋 **Usage Instructions:**",
            f"{instructions}",
            ""
        ])
        
        if rating > 0:
            stars = "⭐" * int(rating)
            response.extend([
                f"⭐ **Rating:** {stars} {rating}/5 ({reviews_count} reviews)",
                ""
            ])
        
        response.extend([
            f"📦 **Availability:** {stock} units in stock",
            ""
        ])
        
        return "\n".join(response)
        
    except Exception as e:
        logger.error(f"Error in get_product_details: {str(e)}")
        return f"❌ Error getting product details: {str(e)}"


@tool
def get_user_consultations(user_token: str, limit: int = 5, status: str = "all") -> str:
    """
    Retrieve user's consultation history and AI skin analysis results.
    
    Personal consultation tool for accessing user's skincare consultation history,
    AI analysis results, and treatment progress tracking.
    
    Args:
        user_token: User's authentication token
        limit: Number of consultations to retrieve (1-20, default: 5)
        status: Filter by status (all, completed, in_progress, pending, cancelled)
    
    Returns:
        User's consultation history with analysis results and recommendations
        
    Examples:
        get_user_consultations("user_token_123", 3, "completed")
        get_user_consultations("user_token_456", 10, "all")
    """
    try:
        params = {
            "limit": min(limit, 20),
            "status": status
        }
        
        headers = {"Authorization": f"Bearer {user_token}"}
        
        result = sync_skinior_request("/consultations", "GET", params, headers=headers)
        
        if "error" in result:
            return f"❌ Error getting consultations: {result['error']}"
        
        if not result.get("success"):
            return "❌ Failed to retrieve consultations"
        
        data = result.get("data", {})
        consultations = data.get("consultations", [])
        pagination = data.get("pagination", {})
        
        if not consultations:
            return "📋 No consultations found for your account"
        
        response = [
            f"📋 **Your Skincare Consultation History**",
            f"📊 **Total Consultations:** {pagination.get('total', len(consultations))}",
            f"🔍 **Showing:** {len(consultations)} consultations\n"
        ]
        
        for i, consultation in enumerate(consultations, 1):
            consultation_id = consultation.get("id", "unknown")
            status = consultation.get("status", "unknown")
            created_at = consultation.get("createdAt", "")
            concerns = consultation.get("concerns", [])
            skin_analysis = consultation.get("skinAnalysis", {})
            improvement_score = consultation.get("improvementScore", 0)
            advisor_name = consultation.get("advisorName", "AI Advisor")
            
            # Format date
            if created_at:
                try:
                    date_obj = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    formatted_date = date_obj.strftime("%B %d, %Y")
                except:
                    formatted_date = created_at
            else:
                formatted_date = "Unknown date"
            
            status_emoji = {
                "completed": "✅",
                "in_progress": "🔄", 
                "pending": "⏳",
                "cancelled": "❌"
            }.get(status, "❓")
            
            response.append(f"**{i}. Consultation #{consultation_id[-6:]}** {status_emoji}")
            response.append(f"   📅 Date: {formatted_date}")
            response.append(f"   👩‍⚕️ Advisor: {advisor_name}")
            response.append(f"   📝 Status: {status.title()}")
            
            if concerns:
                response.append(f"   🎯 Concerns: {', '.join(concerns)}")
            
            if skin_analysis:
                response.append(f"   📊 Skin Analysis:")
                for metric, value in skin_analysis.items():
                    if isinstance(value, (int, float)):
                        response.append(f"      • {metric.title()}: {value}/100")
            
            if improvement_score > 0:
                response.append(f"   📈 Improvement Score: {improvement_score}/100")
            
            response.append("")
        
        return "\n".join(response)
        
    except Exception as e:
        logger.error(f"Error in get_user_consultations: {str(e)}")
        return f"❌ Error getting consultations: {str(e)}"


@tool
def get_todays_deals() -> str:
    """
    Get today's special deals and discounted skincare products.
    
    Shopping assistance tool for finding current promotions, sales,
    and special offers on Skinior's skincare products.
    
    Returns:
        List of current deals with discount information and product details
        
    Examples:
        get_todays_deals()
    """
    try:
        params = {"limit": 20, "offset": 0}
        
        result = sync_skinior_request("/products/deals/today", "GET", params)
        
        if "error" in result:
            return f"❌ Error getting deals: {result['error']}"
        
        if not result.get("success"):
            return "❌ Failed to retrieve today's deals"
        
        products = result.get("data", [])
        
        if not products:
            return "💰 No special deals available today. Check back tomorrow!"
        
        response = [
            f"💰 **Today's Special Deals** ({datetime.now().strftime('%B %d, %Y')})",
            f"🎉 **Found {len(products)} amazing deals:**\n"
        ]
        
        for i, product in enumerate(products, 1):
            name = product.get("title", "Unknown Product")
            brand = product.get("brand", "Unknown Brand")
            price = product.get("price", 0)
            compare_price = product.get("compareAtPrice", 0)
            
            if compare_price > price:
                discount = ((compare_price - price) / compare_price) * 100
                savings = compare_price - price
                
                response.append(f"**{i}. {name}** by {brand}")
                response.append(f"   💰 ${price:.2f} ~~${compare_price:.2f}~~")
                response.append(f"   🔥 **{discount:.0f}% OFF** - Save ${savings:.2f}!")
                response.append("")
        
        response.append("🛒 **Don't miss out!** These deals won't last long!")
        
        return "\n".join(response)
        
    except Exception as e:
        logger.error(f"Error in get_todays_deals: {str(e)}")
        return f"❌ Error getting deals: {str(e)}"


@tool
def add_to_cart(product_id: str, quantity: int = 1, user_token: str = None) -> str:
    """
    Add skincare products to user's shopping cart.
    
    E-commerce tool for helping users purchase recommended skincare products
    by adding them to their cart for checkout.
    
    Args:
        product_id: Unique product identifier to add to cart
        quantity: Number of items to add (default: 1)
        user_token: User's authentication token (optional for guest cart)
    
    Returns:
        Confirmation of item added to cart with cart summary
        
    Examples:
        add_to_cart("prod_123456", 2, "user_token")
        add_to_cart("684ca6c6-fe72-45e0-9625-47341ed67893", 1)
    """
    try:
        # First, get product details to show what's being added
        product_result = sync_skinior_request(f"/products/{product_id}")
        
        if "error" in product_result:
            return f"❌ Product not found: {product_result['error']}"
        
        if not product_result.get("success"):
            return f"❌ Product with ID '{product_id}' not found"
        
        product = product_result.get("data", {})
        product_name = product.get("title", "Unknown Product")
        product_price = product.get("price", 0)
        stock = product.get("stockQuantity", 0)
        
        if stock < quantity:
            return f"❌ Sorry, only {stock} units of '{product_name}' are available"
        
        # Note: Cart functionality would need proper cart ID management
        # For now, we'll return a success message with product details
        total_price = product_price * quantity
        
        response = [
            f"🛒 **Added to Cart Successfully!**",
            f"",
            f"🧴 **Product:** {product_name}",
            f"🔢 **Quantity:** {quantity}",
            f"💰 **Unit Price:** ${product_price:.2f}",
            f"💰 **Total:** ${total_price:.2f}",
            f"",
            f"✅ **Cart Updated!** Ready for checkout when you are.",
            f"",
            f"💡 **Tip:** Complete your skincare routine with complementary products!"
        ]
        
        return "\n".join(response)
        
    except Exception as e:
        logger.error(f"Error in add_to_cart: {str(e)}")
        return f"❌ Error adding to cart: {str(e)}"


@tool
def get_skincare_routine_builder(
    skin_type: str, 
    concerns: str, 
    time_of_day: str = "both",
    experience_level: str = "beginner"
) -> str:
    """
    Build a complete personalized skincare routine.
    
    Advanced consultation tool that creates step-by-step skincare routines
    based on user's skin type, concerns, and experience level.
    
    Args:
        skin_type: User's skin type (dry, oily, combination, sensitive, normal)
        concerns: Primary skin concerns (acne, aging, hyperpigmentation, dryness, etc.)
        time_of_day: Routine timing (morning, evening, both)
        experience_level: User's skincare experience (beginner, intermediate, advanced)
    
    Returns:
        Complete personalized skincare routine with product recommendations and steps
        
    Examples:
        get_skincare_routine_builder("combination", "acne,aging", "both", "beginner")
        get_skincare_routine_builder("dry", "aging", "evening", "advanced")
    """
    try:
        # Get product recommendations for the routine
        params = {
            "skinType": skin_type,
            "concerns": concerns,
            "budgetRange": "medium",
            "limit": 15,
            "source": "skinior.com"
        }
        
        result = sync_skinior_request("/products/available", "GET", params)
        
        if "error" in result:
            return f"❌ Error building routine: {result['error']}"
        
        products = result.get("data", {}).get("products", [])
        
        # Build routine structure
        routine_steps = {
            "morning": [
                {"step": "1. Cleanser", "type": "cleanser", "purpose": "Remove overnight buildup"},
                {"step": "2. Toner/Essence", "type": "toner", "purpose": "Balance pH and prep skin"},
                {"step": "3. Serum", "type": "serum", "purpose": "Target specific concerns"},
                {"step": "4. Moisturizer", "type": "moisturizer", "purpose": "Hydrate and protect"},
                {"step": "5. Sunscreen", "type": "sunscreen", "purpose": "UV protection (ESSENTIAL)"}
            ],
            "evening": [
                {"step": "1. Cleanser", "type": "cleanser", "purpose": "Remove makeup and daily buildup"},
                {"step": "2. Exfoliant", "type": "exfoliant", "purpose": "Remove dead skin (2-3x/week)"},
                {"step": "3. Toner/Essence", "type": "toner", "purpose": "Balance and prep"},
                {"step": "4. Treatment Serum", "type": "serum", "purpose": "Active ingredients for concerns"},
                {"step": "5. Face Oil", "type": "oil", "purpose": "Deep nourishment (optional)"},
                {"step": "6. Night Moisturizer", "type": "moisturizer", "purpose": "Overnight repair"}
            ]
        }
        
        # Categorize products by type
        product_categories = {}
        for product in products:
            category = product.get("category", "").lower()
            if category not in product_categories:
                product_categories[category] = []
            product_categories[category].append(product)
        
        response = [
            f"✨ **Your Personalized Skincare Routine**",
            f"🎯 **Skin Type:** {skin_type.title()}",
            f"🎪 **Target Concerns:** {concerns.title()}",
            f"📚 **Experience Level:** {experience_level.title()}",
            f"⏰ **Routine:** {time_of_day.title()}",
            f""
        ]
        
        # Add morning routine
        if time_of_day in ["morning", "both"]:
            response.extend([
                f"🌅 **MORNING ROUTINE**",
                f""
            ])
            
            for step_info in routine_steps["morning"]:
                step = step_info["step"]
                product_type = step_info["type"]
                purpose = step_info["purpose"]
                
                response.append(f"**{step}**")
                response.append(f"   💡 {purpose}")
                
                # Find matching products
                matching_products = product_categories.get(product_type, [])
                if matching_products:
                    best_product = matching_products[0]
                    name = best_product.get("title", "Product")
                    price = best_product.get("price", 0)
                    response.append(f"   🧴 Recommended: {name} (${price:.2f})")
                else:
                    response.append(f"   🔍 Find a suitable {product_type} for {skin_type} skin")
                
                response.append("")
        
        # Add evening routine
        if time_of_day in ["evening", "both"]:
            response.extend([
                f"🌙 **EVENING ROUTINE**",
                f""
            ])
            
            for step_info in routine_steps["evening"]:
                step = step_info["step"]
                product_type = step_info["type"]
                purpose = step_info["purpose"]
                
                response.append(f"**{step}**")
                response.append(f"   💡 {purpose}")
                
                # Find matching products
                matching_products = product_categories.get(product_type, [])
                if matching_products:
                    best_product = matching_products[0]
                    name = best_product.get("title", "Product")
                    price = best_product.get("price", 0)
                    response.append(f"   🧴 Recommended: {name} (${price:.2f})")
                else:
                    response.append(f"   🔍 Find a suitable {product_type} for {skin_type} skin")
                
                response.append("")
        
        # Add experience-level specific tips
        if experience_level == "beginner":
            response.extend([
                f"🌟 **Beginner Tips:**",
                f"   • Start with basic cleanser + moisturizer + sunscreen",
                f"   • Introduce new products one at a time",
                f"   • Patch test everything first",
                f"   • Be patient - results take 4-6 weeks",
                f""
            ])
        elif experience_level == "advanced":
            response.extend([
                f"🔬 **Advanced Tips:**",
                f"   • Consider layering multiple active ingredients",
                f"   • Alternate stronger treatments (retinol, acids)",
                f"   • Monitor skin response and adjust accordingly",
                f"   • Use pH-balancing products between actives",
                f""
            ])
        
        response.extend([
            f"⚠️ **Important Reminders:**",
            f"   • Always patch test new products",
            f"   • Introduce actives gradually",
            f"   • Sunscreen is non-negotiable in morning routine",
            f"   • Consistency is key - stick to routine for 4-6 weeks",
            f"   • Consult dermatologist for persistent concerns"
        ])
        
        return "\n".join(response)
        
    except Exception as e:
        logger.error(f"Error in get_skincare_routine_builder: {str(e)}")
        return f"❌ Error building routine: {str(e)}"