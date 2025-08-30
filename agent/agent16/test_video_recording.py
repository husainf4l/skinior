#!/usr/bin/env python3
"""
Test script to verify Agent16 video recording endpoint fix
"""

import asyncio
import aiohttp
import os
import json
from datetime import datetime

async def test_video_recording_endpoint():
    """Test the corrected video recording endpoint"""
    
    # Get authentication credentials - use API key for room operations
    api_key = os.getenv("AGENT16_API_KEY")
    
    # Test data
    room_name = "test-room-123"
    video_url = "https://4wk-garage-media.s3.me-central-1.amazonaws.com/recordings/test-room-123_video.mp4"
    
    # Prepare headers - use API key authentication for room operations
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["x-api-key"] = api_key
        print(f"🔑 Using API key: {api_key[:20]}...")
    else:
        print("⚠️ No API key found for room video operations!")
    
    # Prepare payload according to backend specification
    payload = {
        "videoUrl": video_url,
        "duration": 1800,  # 30 minutes
        "fileSize": 52428800,  # 50MB
        "format": "mp4",
        "metadata": {
            "resolution": "1080p",
            "bitrate": "2000kbps",
            "roomId": room_name,
            "tested_at": datetime.now().isoformat()
        }
    }
    
    # Test endpoint
    endpoint = f"http://localhost:4008/api/rooms/{room_name}/save-video"
    
    print("🎥 Testing Video Recording Endpoint")
    print("=" * 50)
    print(f"Endpoint: {endpoint}")
    print(f"Headers: {json.dumps(headers, indent=2)}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    print()
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(endpoint, json=payload, headers=headers) as resp:
                print(f"Status: {resp.status}")
                text = await resp.text()
                print(f"Response: {text}")
                
                if resp.status in (200, 201):
                    print("✅ Video recording endpoint test PASSED!")
                    return True
                else:
                    print("❌ Video recording endpoint test FAILED!")
                    return False
                    
    except Exception as e:
        print(f"❌ Error testing video recording endpoint: {e}")
        return False

async def test_old_endpoint_for_comparison():
    """Test the old endpoint to confirm it fails"""
    
    # Get authentication credentials - use API key for room operations
    api_key = os.getenv("AGENT16_API_KEY")
    
    # Test data
    room_name = "test-room-123"
    video_url = "https://4wk-garage-media.s3.me-central-1.amazonaws.com/recordings/test-room-123_video.mp4"
    
    # Prepare headers - use API key authentication for room operations
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["x-api-key"] = api_key
    
    # Old payload format
    payload = {
        "videoLink": video_url,
        "roomId": room_name
    }
    
    # Old endpoint (should fail)
    endpoint = f"http://localhost:4008/interviews/room/{room_name}/save-video"
    
    print("🔍 Testing OLD Video Recording Endpoint (should fail)")
    print("=" * 60)
    print(f"Endpoint: {endpoint}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    print()
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(endpoint, json=payload, headers=headers) as resp:
                print(f"Status: {resp.status}")
                text = await resp.text()
                print(f"Response: {text}")
                
                if resp.status == 404:
                    print("✅ Old endpoint correctly returns 404 (as expected)")
                    return True
                else:
                    print("⚠️ Old endpoint returned unexpected status")
                    return False
                    
    except Exception as e:
        print(f"❌ Error testing old endpoint: {e}")
        return False

async def main():
    """Main test function"""
    print("🔬 Agent16 Video Recording Endpoint Test")
    print("=" * 60)
    print()
    
    # Test old endpoint first
    print("1. Testing OLD endpoint (should fail with 404)")
    old_result = await test_old_endpoint_for_comparison()
    print()
    
    # Test new endpoint
    print("2. Testing NEW endpoint (should succeed)")
    new_result = await test_video_recording_endpoint()
    print()
    
    # Summary
    print("📊 Test Summary")
    print("=" * 30)
    print(f"Old endpoint (404 expected): {'✅ PASS' if old_result else '❌ FAIL'}")
    print(f"New endpoint (200/201 expected): {'✅ PASS' if new_result else '❌ FAIL'}")
    
    if old_result and new_result:
        print("\n🎉 All tests passed! Video recording endpoint fix is working.")
    else:
        print("\n⚠️ Some tests failed. Check the implementation.")

if __name__ == "__main__":
    asyncio.run(main())
