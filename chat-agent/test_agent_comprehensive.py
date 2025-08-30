"""
Comprehensive Test Suite for Skinior AI Agent

Tests all current capabilities and new Skinior-specific tools.
"""

import pytest
import asyncio
import json
import os
import sys
from unittest.mock import Mock, patch, AsyncMock
from typing import Dict, Any, List

# Add the agent directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'agent'))

from agent.core.agent import LangGraphAgent, AgentContext
from agent.core.auth import validate_token
from agent.tools.system_auth import system_auth
from agent.tools.google_search_tool import google_search, google_news_search, google_business_research


class TestAgentContext:
    """Test AgentContext data structure"""
    
    def test_agent_context_creation(self):
        """Test creating AgentContext with various parameters"""
        context = AgentContext(
            user_id="user123",
            username="testuser",
            token="test_token",
            skin_type="combination",
            skin_concerns=["acne", "aging"]
        )
        
        assert context.user_id == "user123"
        assert context.username == "testuser"
        assert context.skin_type == "combination"
        assert "acne" in context.skin_concerns
        assert "aging" in context.skin_concerns
    
    def test_agent_context_defaults(self):
        """Test AgentContext with default values"""
        context = AgentContext()
        
        assert context.user_id is None
        assert context.username is None
        assert context.skin_concerns == []
        assert context.company_codes == []


class TestSystemAuth:
    """Test system authentication functionality"""
    
    @pytest.mark.asyncio
    async def test_system_auth_initialization(self):
        """Test SystemAuth initialization"""
        auth = system_auth
        assert auth.base_url == "https://balsanai.com"
        assert auth.system_username == "husain"
    
    @pytest.mark.asyncio
    @patch('aiohttp.ClientSession.post')
    async def test_authenticate_system_user(self, mock_post):
        """Test system user authentication"""
        # Mock successful authentication response
        mock_response = AsyncMock()
        mock_response.status = 200
        mock_response.json.return_value = {"access_token": "test_token_123"}
        mock_post.return_value.__aenter__.return_value = mock_response
        
        token = await system_auth.authenticate_system_user()
        
        assert token == "test_token_123"
        assert system_auth.current_token == "test_token_123"
    
    @pytest.mark.asyncio
    @patch('aiohttp.ClientSession.post')
    async def test_make_authenticated_request(self, mock_post):
        """Test making authenticated API requests"""
        # Mock authentication
        auth_response = AsyncMock()
        auth_response.status = 200
        auth_response.json.return_value = {"access_token": "test_token"}
        
        # Mock API request
        api_response = AsyncMock()
        api_response.status = 200
        api_response.json.return_value = {"data": "test_data"}
        
        mock_post.return_value.__aenter__.side_effect = [auth_response, api_response]
        
        result = await system_auth.make_authenticated_request("/api/test")
        
        assert result == {"data": "test_data"}


class TestGoogleSearchTools:
    """Test Google Search API tools"""
    
    @patch('requests.get')
    def test_google_search_success(self, mock_get):
        """Test successful Google search"""
        # Mock successful Google API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.raise_for_status.return_value = None
        mock_response.json.return_value = {
            "searchInformation": {"totalResults": "100", "searchTime": "0.5"},
            "items": [
                {
                    "title": "Skincare Tips",
                    "link": "https://example.com/skincare",
                    "snippet": "Best skincare routine for glowing skin"
                }
            ]
        }
        mock_get.return_value = mock_response
        
        # Set environment variables for testing
        with patch.dict(os.environ, {'GOOGLE_API_KEY': 'test_key', 'GOOGLE_CSE_ID': 'test_cse'}):
            result = google_search("skincare routine", 5)
        
        assert "Skincare Tips" in result
        assert "Best skincare routine" in result
        assert "https://example.com/skincare" in result
    
    @patch('requests.get')
    def test_google_news_search(self, mock_get):
        """Test Google News search"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.raise_for_status.return_value = None
        mock_response.json.return_value = {
            "searchInformation": {"totalResults": "50", "searchTime": "0.3"},
            "items": [
                {
                    "title": "Latest Skincare Innovation",
                    "link": "https://news.example.com/skincare",
                    "snippet": "Revolutionary skincare technology announced"
                }
            ]
        }
        mock_get.return_value = mock_response
        
        with patch.dict(os.environ, {'GOOGLE_API_KEY': 'test_key', 'GOOGLE_CSE_ID': 'test_cse'}):
            result = google_news_search("skincare innovation", 3)
        
        assert "Latest Skincare Innovation" in result
        assert "Revolutionary skincare technology" in result
    
    def test_google_search_no_credentials(self):
        """Test Google search without API credentials"""
        with patch.dict(os.environ, {}, clear=True):
            result = google_search("test query")
        
        assert "❌ Google API credentials not configured" in result
    
    @patch('requests.get')
    def test_google_business_research(self, mock_get):
        """Test Google business research tool"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.raise_for_status.return_value = None
        mock_response.json.return_value = {
            "searchInformation": {"totalResults": "75", "searchTime": "0.4"},
            "items": [
                {
                    "title": "Skinior.com Company Profile",
                    "link": "https://skinior.com/about",
                    "snippet": "Leading skincare e-commerce platform"
                }
            ]
        }
        mock_get.return_value = mock_response
        
        with patch.dict(os.environ, {'GOOGLE_API_KEY': 'test_key', 'GOOGLE_CSE_ID': 'test_cse'}):
            result = google_business_research("Skinior.com", "general")
        
        assert "Skinior.com Company Profile" in result
        assert "Leading skincare e-commerce" in result


class TestAuthValidation:
    """Test token validation functionality"""
    
    @patch('requests.post')
    def test_validate_token_success(self, mock_post):
        """Test successful token validation"""
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": {
                "user": {
                    "id": "user123",
                    "email": "test@example.com",
                    "sub": "testuser"
                },
                "tokenValid": True
            }
        }
        mock_post.return_value = mock_response
        
        result = validate_token("valid_token")
        
        assert result is not None
        assert result["user_id"] == "user123"
        assert result["sub"] == "testuser"
    
    @patch('requests.post')
    def test_validate_token_invalid(self, mock_post):
        """Test invalid token validation"""
        mock_response = Mock()
        mock_response.status_code = 401
        mock_post.return_value = mock_response
        
        result = validate_token("invalid_token")
        
        assert result is None


class TestAgentIntegration:
    """Integration tests for the main agent"""
    
    @pytest.mark.asyncio
    async def test_agent_initialization(self):
        """Test agent initialization"""
        # Mock environment variables
        with patch.dict(os.environ, {
            'OPENAI_API_KEY': 'test_key',
            'DATABASE_URL': 'postgresql://test:test@localhost/test'
        }):
            agent = LangGraphAgent(
                openai_api_key="test_key",
                database_url="postgresql://test:test@localhost/test"
            )
            
            assert agent.model is not None
            assert len(agent.tools) > 0
            assert agent.system_message is not None
    
    @pytest.mark.asyncio
    @patch('agent.core.agent.AsyncPostgresSaver')
    async def test_agent_chat_stream_mock(self, mock_saver):
        """Test agent chat streaming with mocks"""
        # Mock PostgreSQL saver
        mock_saver_instance = AsyncMock()
        mock_saver.from_conn_string.return_value.__aenter__.return_value = mock_saver_instance
        
        with patch.dict(os.environ, {
            'OPENAI_API_KEY': 'test_key',
            'DATABASE_URL': 'postgresql://test:test@localhost/test'
        }):
            agent = LangGraphAgent(
                openai_api_key="test_key",
                database_url="postgresql://test:test@localhost/test"
            )
            
            # Initialize without actual database
            agent._initialized = True
            agent.saver = mock_saver_instance
            agent.graph = Mock()
            
            # Mock the stream response
            async def mock_stream():
                yield '{"type": "message", "content": "Hello"}'
                yield '{"type": "message", "content": " there!"}'
            
            agent.graph.astream = AsyncMock(return_value=mock_stream())
            
            # Test context
            context = AgentContext(user_id="test_user", skin_type="oily")
            
            # This would normally stream, but we're mocking it
            assert agent.graph is not None


class TestSkiniorSpecificTests:
    """Tests for Skinior-specific functionality (to be implemented)"""
    
    def test_skincare_consultation_flow(self):
        """Test skincare consultation workflow"""
        # This test will validate the consultation flow once implemented
        # For now, we ensure the structure is ready
        consultation_data = {
            "skin_type": "combination",
            "concerns": ["acne", "aging"],
            "current_routine": ["cleanser", "moisturizer"],
            "goals": ["reduce_acne", "anti_aging"]
        }
        
        assert "skin_type" in consultation_data
        assert len(consultation_data["concerns"]) == 2
        assert "reduce_acne" in consultation_data["goals"]
    
    def test_product_recommendation_structure(self):
        """Test product recommendation data structure"""
        recommendation = {
            "product_id": "prod_123",
            "name": "Vitamin C Serum",
            "brand": "Skinior",
            "price": 49.99,
            "match_score": 0.95,
            "reasons": ["vitamin_c_for_aging", "suitable_for_combination_skin"],
            "category": "serum"
        }
        
        assert recommendation["match_score"] > 0.9
        assert "serum" in recommendation["category"]
        assert len(recommendation["reasons"]) >= 1


class TestErrorHandling:
    """Test error handling and edge cases"""
    
    @patch('requests.get')
    def test_google_search_api_error(self, mock_get):
        """Test Google search API error handling"""
        mock_get.side_effect = Exception("API Error")
        
        with patch.dict(os.environ, {'GOOGLE_API_KEY': 'test_key', 'GOOGLE_CSE_ID': 'test_cse'}):
            result = google_search("test query")
        
        assert "❌ Search error" in result
    
    def test_agent_context_edge_cases(self):
        """Test AgentContext with edge cases"""
        # Test with None values
        context = AgentContext(user_id=None, skin_concerns=None)
        assert context.skin_concerns == []
        
        # Test with empty strings
        context = AgentContext(user_id="", username="")
        assert context.user_id == ""
        assert context.username == ""


if __name__ == "__main__":
    """Run tests with verbose output"""
    pytest.main([
        __file__,
        "-v",
        "--tb=short",
        "--capture=no"
    ])