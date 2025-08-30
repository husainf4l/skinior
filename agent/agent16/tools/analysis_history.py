"""
Analysis History Management Tools
Provides comprehensive tools for managing user skin analysis history.
"""

import logging
import asyncio
import os
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import aiohttp
import json

logger = logging.getLogger(__name__)


class AnalysisHistoryManager:
    """
    Manages user skin analysis history with comprehensive tracking and retrieval capabilities.
    """
    
    def __init__(self, backend_url: str = "http://localhost:4008", auth_token: str = None, api_key: str = None):
        self.backend_url = backend_url
        self.auth_token = auth_token or os.getenv("AGENT16_AUTH_TOKEN")
        self.api_key = api_key or os.getenv("AGENT16_API_KEY")
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
            
            # Add authentication headers
            if self.auth_token:
                headers["Authorization"] = f"Bearer {self.auth_token}"
            if self.api_key:
                headers["x-api-key"] = self.api_key
            
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
    
    async def create_analysis_session(self, user_id: str, session_id: str, language: str = "english") -> Dict:
        """
        Create a new analysis session.
        
        Args:
            user_id: Unique user identifier
            session_id: Session identifier
            language: Analysis language (english/arabic)
            
        Returns:
            Dict containing session information
        """
        try:
            session_data = {
                "userId": user_id,
                "sessionId": session_id,
                "language": language,
                "status": "in_progress",
                "created_at": datetime.utcnow().isoformat(),
                "metadata": {
                    "agent_version": "agent16",
                    "analysis_type": "advanced_skin_analysis"
                }
            }
            
            result = await self._make_request("POST", "/api/analysis-sessions", session_data)
            
            if "error" not in result:
                logger.info(f"✅ Analysis session created for user {user_id}")
                return result
            else:
                logger.error(f"❌ Failed to create analysis session: {result['error']}")
                return result
                
        except Exception as e:
            logger.error(f"❌ Error creating analysis session: {e}")
            return {"error": str(e)}
    
    async def save_analysis_data(self, user_id: str, analysis_id: str, analysis_type: str, data: Dict) -> Dict:
        """
        Save analysis data to the database.
        
        Args:
            user_id: Unique user identifier
            analysis_id: Analysis session identifier
            analysis_type: Type of analysis data
            data: Analysis data to save
            
        Returns:
            Dict containing save result
        """
        try:
            save_data = {
                "userId": user_id,
                "analysisId": analysis_id,
                "analysisType": analysis_type,
                "data": data,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            result = await self._make_request("POST", "/api/analysis-data", save_data)
            
            if "error" not in result:
                logger.info(f"✅ Analysis data saved: {analysis_type}")
                return result
            else:
                logger.error(f"❌ Failed to save analysis data: {result['error']}")
                return result
                
        except Exception as e:
            logger.error(f"❌ Error saving analysis data: {e}")
            return {"error": str(e)}
    
    async def get_user_analysis_history(self, user_id: str, limit: int = 10, offset: int = 0) -> List[Dict]:
        """
        Retrieve user's analysis history.
        
        Args:
            user_id: Unique user identifier
            limit: Number of records to retrieve
            offset: Number of records to skip
            
        Returns:
            List of analysis history records
        """
        try:
            endpoint = f"/api/users/{user_id}/analysis-history?limit={limit}&offset={offset}"
            result = await self._make_request("GET", endpoint)
            
            if "error" not in result:
                history = result.get("history", [])
                logger.info(f"✅ Retrieved {len(history)} analysis records for user {user_id}")
                return history
            else:
                logger.error(f"❌ Failed to get analysis history: {result['error']}")
                return []
                
        except Exception as e:
            logger.error(f"❌ Error getting analysis history: {e}")
            return []
    
    async def get_analysis_session(self, session_id: str) -> Optional[Dict]:
        """
        Get specific analysis session details.
        
        Args:
            session_id: Session identifier
            
        Returns:
            Session details or None if not found
        """
        try:
            endpoint = f"/api/analysis-sessions/{session_id}"
            result = await self._make_request("GET", endpoint)
            
            if "error" not in result:
                logger.info(f"✅ Retrieved analysis session: {session_id}")
                return result
            else:
                logger.error(f"❌ Failed to get analysis session: {result['error']}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error getting analysis session: {e}")
            return None
    
    async def update_analysis_session(self, session_id: str, status: str, data: Dict = None) -> Dict:
        """
        Update analysis session status and data.
        
        Args:
            session_id: Session identifier
            status: New status (in_progress, completed, cancelled)
            data: Additional data to update
            
        Returns:
            Dict containing update result
        """
        try:
            update_data = {
                "status": status,
                "updated_at": datetime.utcnow().isoformat()
            }
            
            if data:
                update_data.update(data)
            
            result = await self._make_request("PUT", f"/api/analysis-sessions/{session_id}", update_data)
            
            if "error" not in result:
                logger.info(f"✅ Analysis session updated: {session_id} -> {status}")
                return result
            else:
                logger.error(f"❌ Failed to update analysis session: {result['error']}")
                return result
                
        except Exception as e:
            logger.error(f"❌ Error updating analysis session: {e}")
            return {"error": str(e)}
    
    async def get_user_progress_summary(self, user_id: str) -> Dict:
        """
        Get user's progress summary across all analyses.
        
        Args:
            user_id: Unique user identifier
            
        Returns:
            Dict containing progress summary
        """
        try:
            endpoint = f"/api/users/{user_id}/progress-summary"
            result = await self._make_request("GET", endpoint)
            
            if "error" not in result:
                logger.info(f"✅ Retrieved progress summary for user {user_id}")
                return result
            else:
                logger.error(f"❌ Failed to get progress summary: {result['error']}")
                return {"error": result["error"]}
                
        except Exception as e:
            logger.error(f"❌ Error getting progress summary: {e}")
            return {"error": str(e)}
    
    async def delete_analysis_session(self, session_id: str) -> Dict:
        """
        Delete analysis session and associated data.
        
        Args:
            session_id: Session identifier
            
        Returns:
            Dict containing deletion result
        """
        try:
            result = await self._make_request("DELETE", f"/api/analysis-sessions/{session_id}")
            
            if "error" not in result:
                logger.info(f"✅ Analysis session deleted: {session_id}")
                return result
            else:
                logger.error(f"❌ Failed to delete analysis session: {result['error']}")
                return result
                
        except Exception as e:
            logger.error(f"❌ Error deleting analysis session: {e}")
            return {"error": str(e)}


# Utility functions for easy access
async def create_analysis_session(user_id: str, session_id: str, language: str = "english", auth_token: str = None, api_key: str = None) -> Dict:
    """Create a new analysis session."""
    async with AnalysisHistoryManager(auth_token=auth_token, api_key=api_key) as manager:
        return await manager.create_analysis_session(user_id, session_id, language)


async def save_analysis_data(user_id: str, analysis_id: str, analysis_type: str, data: Dict, auth_token: str = None, api_key: str = None) -> Dict:
    """Save analysis data."""
    async with AnalysisHistoryManager(auth_token=auth_token, api_key=api_key) as manager:
        return await manager.save_analysis_data(user_id, analysis_id, analysis_type, data)


async def get_user_analysis_history(user_id: str, limit: int = 10, offset: int = 0, auth_token: str = None, api_key: str = None) -> List[Dict]:
    """Get user analysis history."""
    async with AnalysisHistoryManager(auth_token=auth_token, api_key=api_key) as manager:
        return await manager.get_user_analysis_history(user_id, limit, offset)


async def get_analysis_session(session_id: str) -> Optional[Dict]:
    """Get analysis session details."""
    async with AnalysisHistoryManager() as manager:
        return await manager.get_analysis_session(session_id)


async def update_analysis_session(session_id: str, status: str, data: Dict = None) -> Dict:
    """Update analysis session."""
    async with AnalysisHistoryManager() as manager:
        return await manager.update_analysis_session(session_id, status, data)


async def get_user_progress_summary(user_id: str) -> Dict:
    """Get user progress summary."""
    async with AnalysisHistoryManager() as manager:
        return await manager.get_user_progress_summary(user_id)
