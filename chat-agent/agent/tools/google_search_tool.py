"""
Google Search Tools for Skinior AI Agent

Provides comprehensive web search capabilities using Google Custom Search API
for skincare research, beauty trends, and dermatology information gathering.

Author: Skinior AI Agent
Date: 2025-08-22
"""

import os
import requests
import logging
from typing import Optional
from langchain_core.tools import tool

# Set up logging
logger = logging.getLogger(__name__)


def _perform_google_search(query: str, num_results: int = 5, search_type: str = "web") -> str:
    """
    Internal function to perform Google Custom Search API request.
    
    Args:
        query: Search query string
        num_results: Number of results to return (1-10)
        search_type: Type of search ("web", "news")
    
    Returns:
        Formatted search results as string
    """
    # Get API credentials from environment
    api_key = os.getenv("GOOGLE_API_KEY")
    cse_id = os.getenv("GOOGLE_CSE_ID")

    if not api_key or not cse_id:
        return "❌ Google API credentials not configured. Please check GOOGLE_API_KEY and GOOGLE_CSE_ID environment variables."

    # Validate num_results
    if num_results < 1 or num_results > 10:
        num_results = 5

    try:
        # Google Custom Search API endpoint
        url = "https://www.googleapis.com/customsearch/v1"

        # Parameters for the search
        params = {
            "key": api_key,
            "cx": cse_id,
            "q": query,
            "num": min(num_results, 10),  # API limit is 10
        }

        # Add search type specific parameters
        if search_type == "news":
            params["tbm"] = "nws"  # News search
            params["sort"] = "date"  # Sort by date for news

        # Make the API request
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()

        # Check if we have results
        if "items" not in data or not data["items"]:
            return f"🔍 No results found for query: '{query}'"

        # Format the results
        search_info = data.get("searchInformation", {})
        total_results = search_info.get("totalResults", "Unknown")
        search_time = search_info.get("searchTime", "Unknown")

        results = []
        results.append(f"🔍 Google Search Results for '{query}'")
        results.append(f"Found {total_results} results in {search_time} seconds\n")

        for i, item in enumerate(data["items"], 1):
            title = item.get("title", "No title")
            link = item.get("link", "")
            snippet = item.get("snippet", "No description available")

            # Clean up snippet - remove newlines and extra spaces
            snippet = " ".join(snippet.split())

            results.append(f"{i}. **{title}**")
            results.append(f"   {snippet}")
            results.append(f"   🔗 {link}\n")

        return "\n".join(results)

    except requests.RequestException as e:
        logger.error(f"Google API request failed: {e}")
        return f"❌ Search request failed: {str(e)}"
    except Exception as e:
        logger.error(f"Google Search tool error: {e}")
        return f"❌ Search error: {str(e)}"


@tool
def google_search(query: str, num_results: int = 5) -> str:
    """
    Search Google using Custom Search API for comprehensive skincare and beauty information.

    Core search tool for finding relevant information on:
    - Skincare ingredients and their benefits
    - Beauty product reviews and comparisons
    - Dermatology research and scientific studies
    - Skincare routines and best practices
    - Latest beauty trends and innovations

    Args:
        query: Search query (e.g., "retinol benefits skincare", "vitamin C serum comparison")
        num_results: Number of search results to return (1-10, default: 5)

    Returns:
        Search results with titles, descriptions, and URLs

    Examples:
        google_search("hyaluronic acid moisturizer benefits")
        google_search("anti-aging skincare routine 2025", 8)
    """
    return _perform_google_search(query, num_results, "web")


@tool
def google_news_search(query: str, num_results: int = 5) -> str:
    """
    Search Google News for recent skincare and beauty news articles.

    Specialized tool for finding recent news and current events related to:
    - Skincare industry innovations and breakthroughs
    - New product launches and brand announcements
    - Dermatology research and clinical studies
    - Beauty trends and consumer insights
    - Ingredient discoveries and regulatory updates

    Args:
        query: News search query (e.g., "skincare innovation 2025", "retinol dermatology news")
        num_results: Number of news articles to return (1-10, default: 5)

    Returns:
        Recent news articles with titles, snippets, and publication info

    Examples:
        google_news_search("skincare breakthrough dermatology")
        google_news_search("beauty industry trends 2025", 8)
    """
    return _perform_google_search(query, num_results, "news")


@tool
def google_business_research(
    company_or_topic: str, research_type: str = "general"
) -> str:
    """
    Perform targeted skincare and beauty industry research using Google Search.

    Advanced research tool for deep beauty industry intelligence on:
    - Skincare company profiles and brand information
    - Competitive analysis in beauty market
    - Product performance and consumer reviews
    - Beauty industry trends and market opportunities

    Args:
        company_or_topic: Beauty company name or skincare topic to research
        research_type: Type of research to conduct:
            - "general": Company/brand overview and basic information
            - "competitors": Competitive analysis and market landscape
            - "products": Product performance and consumer feedback
            - "news": Latest news and brand updates

    Returns:
        Comprehensive beauty industry research results

    Examples:
        google_business_research("CeraVe skincare", "competitors")
        google_business_research("anti-aging serum market", "products")
        google_business_research("Neutrogena brand", "general")
    """
    if not company_or_topic:
        return "❌ Company or topic is required for beauty industry research"

    # Create targeted search queries based on research type
    if research_type == "competitors":
        query = f"{company_or_topic} competitors skincare beauty market analysis"
    elif research_type == "products":
        query = f"{company_or_topic} product reviews performance consumer feedback"
    elif research_type == "news":
        query = f"{company_or_topic} latest news updates beauty industry"
    else:  # general
        query = f"{company_or_topic} skincare brand profile company information"

    # Use standard search with 7 results for comprehensive research
    return _perform_google_search(query, 7, "web")
