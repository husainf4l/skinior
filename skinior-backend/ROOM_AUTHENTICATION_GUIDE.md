# 🔐 LiveKit Room Authentication Guide

## Overview

The LiveKit room system now has **full JWT authentication** and **user data integration**! When creating rooms, the system automatically extracts user information from the JWT token and personalizes the entire experience.

---

## 🔑 **How Authentication Works**

### **Before (Problems):**
- ❌ Used optional `userId` parameters
- ❌ Fell back to "anonymous" users  
- ❌ No user data integration
- ❌ Generic room experience
- ❌ No access control

### **After (Enhanced):**
- ✅ **JWT token required** for all endpoints
- ✅ **User data extracted** from token automatically
- ✅ **Personalized room creation** with user details
- ✅ **Access control** - users can only access their own rooms
- ✅ **Enhanced metadata** with user profile integration

---

## 🚀 **Room Creation Flow**

### 1. **Authentication Check**
```typescript
@UseGuards(CombinedAuthGuard) // JWT or API Key required
```

### 2. **User Data Extraction**
```typescript
// From JWT token payload:
const user = {
  id: "82cd0aa3-5e91-4282-b34d-e57263277b98",
  email: "user@example.com", 
  role: "user"
}

// From database:
const userDetails = {
  firstName: "John",
  lastName: "Smith", 
  email: "john.smith@example.com",
  memberSince: "2024-01-15T10:30:00Z"
}
```

### 3. **Personalized Room Creation**
```typescript
// Auto-generated room name with user info:
const roomName = `skincare-John-1737427200-abc123def`;

// User display name:
const displayName = "John Smith"; // or fallback to firstName or email

// Personalized AI prompt:
const aiPrompt = {
  english: "You are consulting with John Smith, a valued client...",
  arabic: "تستشير مع John Smith، عميل قيم..."
}
```

### 4. **Enhanced Room Metadata**
```json
{
  "type": "skincare_consultation",
  "sessionType": "general_analysis",
  "createdBy": "82cd0aa3-5e91-4282-b34d-e57263277b98",
  "user": {
    "id": "82cd0aa3-5e91-4282-b34d-e57263277b98",
    "email": "john.smith@example.com",
    "displayName": "John Smith",
    "firstName": "John",
    "lastName": "Smith",
    "role": "user",
    "memberSince": "2024-01-15T10:30:00Z"
  },
  "description": "Personalized skincare consultation for John Smith",
  "sessionSettings": {
    "analysisType": "general_analysis",
    "personalizedGreeting": true,
    "productRecommendations": true,
    "followUpReminders": true
  },
  "features": [
    "skin_analysis",
    "product_recommendations", 
    "personalized_advice",
    "bilingual_support",
    "user_profile_integration",
    "session_history"
  ]
}
```

---

## 🔧 **API Endpoints & Authentication**

### **Create Room** - `POST /api/rooms`
```bash
curl -X POST "http://localhost:4008/api/rooms" \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "english",
    "sessionType": "acne_analysis"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "room": { "id": "...", "name": "skincare-John-..." },
    "user": {
      "displayName": "John Smith",
      "email": "john.smith@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "participantName": "John Smith",
    "liveKitUrl": "wss://...",
    "aiPrompt": "You are consulting with John Smith...",
    "language": "english",
    "sessionType": "acne_analysis",
    "expiresAt": "2025-01-20T14:30:00Z"
  },
  "message": "Room created successfully",
  "timestamp": "2025-01-20T12:30:00Z"
}
```

### **List User Rooms** - `GET /api/rooms`
```bash
curl -X GET "http://localhost:4008/api/rooms" \
  -H "Authorization: Bearer [JWT_TOKEN]"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "rooms": [
      {
        "id": "room-123",
        "name": "skincare-John-1737427200-abc123",
        "createdAt": "2025-01-20T12:30:00Z",
        "durationMinutes": 15,
        "sessionType": "acne_analysis",
        "language": "english",
        "status": "active",
        "userDisplayName": "John Smith"
      }
    ],
    "count": 1
  }
}
```

### **Get Room Status** - `GET /api/rooms/{roomName}/status`
```bash
curl -X GET "http://localhost:4008/api/rooms/skincare-John-1737427200-abc123/status" \
  -H "Authorization: Bearer [JWT_TOKEN]"
```

### **Refresh Token** - `POST /api/rooms/refresh-token`
```bash
curl -X POST "http://localhost:4008/api/rooms/refresh-token" \
  -H "Authorization: Bearer [JWT_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{
    "roomName": "skincare-John-1737427200-abc123"
  }'
```

---

## 🔐 **Access Control**

### **What Users Can Do:**
- ✅ Create their own rooms
- ✅ List their own rooms  
- ✅ Get status of their own rooms
- ✅ Refresh tokens for their own rooms
- ✅ Leave their own rooms
- ✅ Delete their own rooms

### **What Users CANNOT Do:**
- ❌ Access other users' rooms
- ❌ Get status of rooms they didn't create
- ❌ Delete rooms created by others
- ❌ Generate tokens for other users' rooms

---

## 💡 **Benefits of Enhanced Authentication**

### **1. Personalization**
- AI agent knows the user's name and details
- Customized greetings and recommendations
- Tailored skin analysis based on user profile

### **2. Security**
- Room access restricted to creators
- JWT-based authentication
- User-specific token generation

### **3. Better UX**
- Meaningful room names with user info
- Session history tracking
- Personalized analysis experience

### **4. Data Integration**
- User profile automatically included
- Session metadata enriched with user details
- Ready for analysis history tracking

---

## 🧪 **Testing Authentication**

### **Test with Regular User:**
```bash
# 1. Login to get JWT token
curl -X POST "http://localhost:4008/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# 2. Use token to create room
curl -X POST "http://localhost:4008/api/rooms" \
  -H "Authorization: Bearer [JWT_TOKEN_FROM_LOGIN]" \
  -H "Content-Type: application/json" \
  -d '{"language": "arabic", "sessionType": "general_analysis"}'
```

### **Test with Agent16:**
```bash
# Use Agent16's long-term token
curl -X POST "http://localhost:4008/api/rooms" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"language": "english", "sessionType": "advanced_analysis"}'
```

---

## 🎯 **Result: Complete Integration**

Now when Agent16 or any user creates a room:

1. **🔐 Authentication verified** via JWT token
2. **👤 User data extracted** from token and database  
3. **🏠 Personalized room created** with user details
4. **🎫 LiveKit token generated** with user's display name
5. **🤖 AI prompt customized** with user's name and context
6. **📊 Session metadata enriched** with user profile
7. **🛡️ Access control enforced** for all operations

**The LiveKit integration is now fully authenticated and user-aware!** 🎉

---

*Updated: January 20, 2025*  
*Status: ✅ Complete & Tested*
