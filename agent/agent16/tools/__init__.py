"""
Agent16 Tools Package
Comprehensive tools for analysis history, product recommendations, and Skinior.com integration.
"""

from .analysis_history import (
    AnalysisHistoryManager,
    create_analysis_session,
    save_analysis_data,
    get_user_analysis_history,
    get_analysis_session,
    update_analysis_session,
    get_user_progress_summary
)

from .product_recommendations import (
    ProductRecommendationsManager,
    get_available_products,
    create_product_recommendations,
    get_user_recommendations,
    update_recommendation_status,
    get_product_details,
    search_products,
    get_recommendation_analytics,
    sync_skinior_products
)

from .skinior_integration import (
    SkiniorIntegrationManager,
    check_product_availability,
    get_skinior_products,
    search_skinior_products,
    get_product_details_from_skinior,
    sync_products_to_backend,
    update_product_availability,
    get_skinior_categories,
    get_skinior_brands,
    validate_skinior_url
)

__version__ = "1.0.0"
__all__ = [
    # Analysis History
    "AnalysisHistoryManager",
    "create_analysis_session",
    "save_analysis_data",
    "get_user_analysis_history",
    "get_analysis_session",
    "update_analysis_session",
    "get_user_progress_summary",
    
    # Product Recommendations
    "ProductRecommendationsManager",
    "get_available_products",
    "create_product_recommendations",
    "get_user_recommendations",
    "update_recommendation_status",
    "get_product_details",
    "search_products",
    "get_recommendation_analytics",
    "sync_skinior_products",
    
    # Skinior Integration
    "SkiniorIntegrationManager",
    "check_product_availability",
    "get_skinior_products",
    "search_skinior_products",
    "get_product_details_from_skinior",
    "sync_products_to_backend",
    "update_product_availability",
    "get_skinior_categories",
    "get_skinior_brands",
    "validate_skinior_url"
]
