# Network Debugging Guide

## 🔍 How to View Network Requests (Like Chrome DevTools)

I've added network logging to your app! Here are your options:

### 1. **Console Logs** (Active Now ✅)

Your app now automatically logs all network requests to the console:

- **🚀 REQUEST**: Shows outgoing requests with URL, headers, body
- **📥 RESPONSE**: Shows responses with status, headers, body, timing
- **❌ NETWORK ERROR**: Shows any errors

**How to view:**

1. Open React Native Debugger or Metro console
2. Send a chat message
3. Look for the colored emoji logs in console
4. Copy the JSON from console logs

### 2. **In-App Debug Button** (Development Only)

In the Chat screen, there's a small network icon (development builds only):

- Tap it for network debugging info
- Shows how to find the logs

### 3. **React Native Debugger** (Best Option)

```bash
# If you want the full Chrome DevTools experience:
npm install -g react-native-debugger
# Then run: react-native-debugger
```

### 4. **Flipper** (Facebook's Tool)

```bash
# Download Flipper from: https://fbflipper.com/
# It has a Network plugin similar to Chrome DevTools
```

## 📋 How to Copy Network Responses

### Method 1: From Console

1. Send a chat message
2. Look for `📥 RESPONSE:` in console
3. Expand the log object
4. Right-click → Copy object
5. Paste into text editor

### Method 2: Using Browser

1. Enable Chrome debugging in React Native
2. Open Chrome DevTools
3. Go to Network tab
4. Send requests and copy responses

### Method 3: Manual Logging

Add this to any function to log specific data:

```javascript
console.log('📋 COPY THIS:', JSON.stringify(data, null, 2));
```

## 🔧 Current Setup

The network logger is automatically enabled in development mode and will show:

- Request URL, method, headers, body
- Response status, headers, body, timing
- Error details if requests fail
- Timestamps for all requests

## 💡 Pro Tips

1. **Filter Console**: Search for "🚀" or "📥" to find network logs quickly
2. **Pretty Print**: All JSON is automatically formatted for readability
3. **Timing**: Each request shows duration in milliseconds
4. **Headers**: Full request/response headers are logged
5. **Errors**: Network errors are clearly marked with ❌

Your chat API calls to `192.168.1.68:8007/chat-agent/chat/stream` will now be fully visible in the console!
