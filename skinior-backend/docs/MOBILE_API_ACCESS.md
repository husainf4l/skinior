# Mobile API Access Configuration

## Overview
Your Skinior backend is now configured to work seamlessly with mobile applications without CORS issues.

## CORS Configuration
The backend now supports:
- ✅ Native mobile apps (React Native, Flutter, Ionic)
- ✅ Hybrid apps (Cordova, PhoneGap, Capacitor)
- ✅ Expo applications
- ✅ Web views within mobile apps
- ✅ Development environments

## Environment Variables
Add these to your `.env` file:
```properties
MOBILE_APP_SCHEME="skinior"           # Your app's custom URL scheme
ALLOW_MOBILE_DEVELOPMENT=true         # Enable for development, disable in production
```

## Supported Origins
The CORS configuration automatically allows:

### Development
- `http://localhost:*` - Local development
- `https://localhost:*` - Local HTTPS development
- `*.expo.dev` - Expo development
- `*.exp.host` - Expo published apps

### Mobile Platforms
- `capacitor://` - Ionic Capacitor apps
- `ionic://` - Ionic apps
- `file://` - Cordova/PhoneGap apps
- Custom scheme: `skinior://` (configurable via MOBILE_APP_SCHEME)

### Production Web
- Your frontend URL from `FRONTEND_URL`
- `https://skinior.com`
- `https://www.skinior.com`

## Mobile App Configuration

### React Native
```javascript
// No special CORS configuration needed
const API_BASE_URL = 'http://YOUR_IP:4008/api';

// For development, use your computer's IP address
const API_BASE_URL = 'http://192.168.1.100:4008/api';
```

### Ionic/Capacitor
```typescript
// capacitor.config.ts
export default {
  appId: 'com.skinior.app',
  appName: 'Skinior',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'http://YOUR_IP:4008',
    cleartext: true // Only for development
  }
};
```

### Flutter
```dart
// No special CORS configuration needed
const String apiBaseUrl = 'http://YOUR_IP:4008/api';
```

### Expo
```javascript
// expo-constants for environment-specific URLs
import Constants from 'expo-constants';

const API_BASE_URL = __DEV__ 
  ? 'http://YOUR_IP:4008/api'  // Development
  : 'https://api.skinior.com/api'; // Production
```

## API Endpoints
Your mobile app can access all endpoints:

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/google`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### User Management
- `GET /api/user/profile`
- `PUT /api/user/profile`

### Waitlist
- `POST /api/waitlist/join`

## Headers Required
Include these headers in your API requests:
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_JWT_TOKEN' // For protected routes
}
```

## Development Tips

### Find Your IP Address
```bash
# Linux/Mac
ifconfig | grep inet

# Windows
ipconfig
```

### Test API Connection
```javascript
// Test if your mobile app can reach the API
fetch('http://YOUR_IP:4008/api/waitlist/join', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com'
  })
})
.then(response => response.json())
.then(data => console.log('API accessible:', data))
.catch(error => console.error('API error:', error));
```

## Production Deployment

### Security Recommendations
1. Set `ALLOW_MOBILE_DEVELOPMENT=false` in production
2. Use HTTPS for your API (`https://api.skinior.com`)
3. Implement proper SSL certificate validation
4. Consider API rate limiting for mobile endpoints

### Production Environment Variables
```properties
# Production .env
ALLOW_MOBILE_DEVELOPMENT=false
FRONTEND_URL="https://skinior.com"
MOBILE_APP_SCHEME="skinior"
```

## Troubleshooting

### Common Issues

1. **"Network request failed"**
   - Check if your mobile device can reach the backend IP
   - Ensure backend is running on `0.0.0.0:4008`, not `localhost:4008`
   - Verify firewall settings

2. **CORS errors in web views**
   - Enable `ALLOW_MOBILE_DEVELOPMENT=true` for development
   - Check if the origin is properly configured

3. **Authentication issues**
   - Ensure JWT tokens are properly stored and sent
   - Check token expiration times

### Debug CORS Issues
Enable debug logging in main.ts:
```typescript
app.enableCors({
  origin: (origin, callback) => {
    console.log('CORS Origin:', origin); // Debug log
    // ... existing logic
  }
});
```

## Support
If you encounter any issues, check the backend logs:
```bash
pm2 logs skinior-backend
```
