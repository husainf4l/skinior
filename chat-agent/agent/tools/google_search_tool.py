"""
Google Search Tools for Al Balsan AI Agent

Provides comprehensive web search capabilities using Google Custom Search API
for market research, business intelligence, and information gathering.

Author: Al Balsan Group AI Agent
Date: 2025-07-30
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
    Search Google using Custom Search API for comprehensive web results.

    Core search tool for finding relevant information on:
    - Company profiles and business information
    - Market research and industry analysis
    - Technical documentation and resources
    - News and current events
    - Product information and comparisons

    Args:
        query: Search query (e.g., "Al Balsan Group Iraq", "electronics market trends")
        num_results: Number of search results to return (1-10, default: 5)

    Returns:
        Search results with titles, descriptions, and URLs

    Examples:
        google_search("Iraq electronics market 2025")
        google_search("ERP software comparison", 8)
    """
    return _perform_google_search(query, num_results, "web")


@tool
def google_news_search(query: str, num_results: int = 5) -> str:
    """
    Search Google News for recent news articles.

    Specialized tool for finding recent news and current events related to:
    - Business and industry news
    - Financial market updates
    - Company announcements and press releases
    - Economic trends and developments
    - Technology and innovation news

    Args:
        query: News search query (e.g., "Iraq economy 2025", "electronics industry news")
        num_results: Number of news articles to return (1-10, default: 5)

    Returns:
        Recent news articles with titles, snippets, and publication info

    Examples:
        google_news_search("Iraq business news")
        google_news_search("Middle East technology companies", 8)
    """
    return _perform_google_search(query, num_results, "news")


@tool
def google_business_research(
    company_or_topic: str, research_type: str = "general"
) -> str:
    """
    Perform targeted business research using Google Search.

    Advanced research tool for deep business intelligence on:
    - Company profiles and corporate information
    - Competitive analysis and market positioning
    - Financial performance and business metrics
    - Industry trends and market opportunities

    Args:
        company_or_topic: Company name or business topic to research
        research_type: Type of research to conduct:
            - "general": Company overview and basic information
            - "competitors": Competitive analysis and market landscape
            - "financial": Financial performance and business metrics
            - "news": Latest news and company updates

    Returns:
        Comprehensive business research results

    Examples:
        google_business_research("Al Balsan Group", "competitors")
        google_business_research("Iraq electronics market", "financial")
        google_business_research("ERP software companies", "general")
    """
    if not company_or_topic:
        return "❌ Company or topic is required for business research"

    # Create targeted search queries based on research type
    if research_type == "competitors":
        query = f"{company_or_topic} competitors market analysis"
    elif research_type == "financial":
        query = f"{company_or_topic} financial performance revenue profit"
    elif research_type == "news":
        query = f"{company_or_topic} latest news updates"
    else:  # general
        query = f"{company_or_topic} business profile company information"

    # Use standard search with 7 results for comprehensive research
    return _perform_google_search(query, 7, "web")
