# 🎥 LiveKit Video Recording - Backend Integration

## 📝 **Agent16 Video Recording Endpoint**

Your Skinior backend now supports video recording storage! Here's how to configure Agent16 to save videos:

---

## 🔗 **Correct Endpoint for Agent16**

### **✅ Use This Endpoint:**
```
POST /api/rooms/{roomName}/save-video
```

### **❌ Not This (Current Agent16 Config):**
```
POST /interviews/room/{roomName}/save-video  // ❌ 404 Error
```

---

## 🛠️ **LiveKit Server Configuration**

### **Update Agent16 Configuration:**

In your Agent16 configuration file, change the video save endpoint from:
```python
# OLD - causing 404 error
video_save_url = f"{backend_url}/interviews/room/{room_name}/save-video"
```

To:
```python
# NEW - correct endpoint
video_save_url = f"{backend_url}/api/rooms/{room_name}/save-video"
```

---

## 📨 **Request Format**

### **Headers:**
```
x-api-key: sk_agent16_9c553abdd336683faa373cea7f3bae2d
Content-Type: application/json
```

### **Request Body:**
```json
{
  "videoUrl": "https://storage.livekit.com/recordings/room_123/video.mp4",
  "duration": 1800,
  "fileSize": 52428800,
  "format": "mp4",
  "metadata": {
    "resolution": "1080p",
    "bitrate": "2000kbps"
  }
}
```

### **Response:**
```json
{
  "success": true,
  "data": {
    "videoUrl": "https://storage.livekit.com/recordings/room_123/video.mp4",
    "roomName": "skincare-Alhussein-1755730398448-xaasyd6dp",
    "recordingId": 1,
    "savedAt": "2025-01-20T12:30:00Z",
    "duration": 1800,
    "fileSize": 52428800
  },
  "message": "Video URL saved successfully",
  "timestamp": "2025-01-20T12:30:00Z"
}
```

---

## 🔐 **Authentication**

**✅ RECOMMENDED for Agent16 - Use API Key:**
```
x-api-key: sk_agent16_9c553abdd336683faa373cea7f3bae2d
```

**Alternative - JWT Token:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Note:** API Key authentication is more reliable for Agent16 system operations.

---

## 📄 **Available Endpoints**

### **1. Save Video Recording**
```
POST /api/rooms/{roomName}/save-video
```

### **2. Get Room Videos**
```
GET /api/rooms/{roomName}/videos
```

### **3. Create Room (existing)**
```
POST /api/rooms
```

---

## 🧪 **Test the Endpoint**

```bash
# Test saving a video URL
curl -X POST "http://localhost:4008/api/rooms/skincare-test-room/save-video" \
  -H "x-api-key: sk_agent16_9c553abdd336683faa373cea7f3bae2d" \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrl": "https://example.com/recording.mp4",
    "duration": 1800,
    "fileSize": 52428800,
    "format": "mp4"
  }'
```

---

## 💾 **How Videos Are Stored**

Videos are stored in the room metadata:
```json
{
  "type": "skincare_consultation",
  "recordings": [
    {
      "videoUrl": "https://storage.livekit.com/recordings/room_123/video.mp4",
      "duration": 1800,
      "fileSize": 52428800,
      "format": "mp4",
      "recordedAt": "2025-01-20T12:30:00Z",
      "recordedBy": "82cd0aa3-5e91-4282-b34d-e57263277b98",
      "metadata": {...}
    }
  ],
  "totalRecordings": 1,
  "lastRecording": {...}
}
```

---

## 🎯 **Summary**

**To Fix Agent16 Video Saving:**
1. ✅ Change endpoint from `/interviews/room/...` to `/api/rooms/...`
2. ✅ Use Agent16 API key authentication: `x-api-key: sk_agent16_9c553abdd336683faa373cea7f3bae2d`
3. ✅ Send video data in the required JSON format
4. ✅ Videos will be stored in room metadata automatically

**The backend is ready - just update the Agent16 endpoint URL!** 🚀

---

*Last Updated: January 20, 2025*  
*Status: ✅ Ready for Agent16 Integration*
