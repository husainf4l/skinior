#!/usr/bin/env python3
"""
Test script for Skinior AI Agent

This script tests the Skinior agent by starting the server and making test requests.
"""

import os
import sys
import time
import requests
import subprocess
import signal
import json
from datetime import datetime, timedelta
import jwt

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def generate_test_token():
    """Generate a test JWT token for authentication"""
    payload = {
        "sub": "test_user",
        "user_id": "test_123", 
        "skin_type": "combination",
        "skin_concerns": ["acne", "anti-aging"],
        "exp": datetime.utcnow() + timedelta(hours=1),
        "iat": datetime.utcnow()
    }
    
    # Use a test secret key
    secret_key = os.getenv("JWT_SECRET_KEY", "test-secret-key-for-skinior")
    token = jwt.encode(payload, secret_key, algorithm="HS256")
    return token

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        response = requests.get("http://localhost:8001/health", timeout=5)
        print(f"Health Check: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_chat_endpoint():
    """Test the chat streaming endpoint"""
    try:
        token = generate_test_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "message": "What are the latest trends in anti-aging skincare?",
            "thread_id": "test_thread_123"
        }
        
        print("Testing chat endpoint...")
        print(f"Request: {payload}")
        
        response = requests.post(
            "http://localhost:8001/chat/stream",
            headers=headers,
            json=payload,
            stream=True,
            timeout=30
        )
        
        print(f"Chat Response Status: {response.status_code}")
        
        if response.status_code == 200:
            print("Response stream:")
            for line in response.iter_lines(decode_unicode=True):
                if line:
                    print(f"  {line}")
        else:
            print(f"Error response: {response.text}")
            
        return response.status_code == 200
        
    except Exception as e:
        print(f"Chat test failed: {e}")
        return False

def main():
    """Main test function"""
    print("🧴 Testing Skinior AI Agent")
    print("=" * 50)
    
    # Check if server is running
    if not test_health_endpoint():
        print("❌ Server not running. Please start with: python main.py")
        print("\nRequired environment variables:")
        print("- OPENAI_API_KEY")
        print("- DATABASE_URL") 
        print("- JWT_SECRET_KEY (optional, defaults to test key)")
        return False
    
    print("✅ Health check passed")
    
    # Test chat endpoint
    if test_chat_endpoint():
        print("✅ Chat endpoint test passed")
        return True
    else:
        print("❌ Chat endpoint test failed")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🎉 All tests passed! Skinior AI Agent is working correctly.")
    else:
        print("\n💥 Some tests failed. Check the logs above.")
    
    sys.exit(0 if success else 1)