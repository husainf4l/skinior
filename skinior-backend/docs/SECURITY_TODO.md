# Security Configuration TODO

## Current Status
🚨 **CORS is currently OPEN to all domains** - configured for easy development

## When Ready for Production Security

### 1. Update main.ts CORS Configuration
Replace the current open CORS with restricted origins:

```typescript
// main.ts - Production CORS Configuration
app.enableCors({
  origin: [
    process.env.FRONTEND_URL,
    'https://skinior.com',
    'https://www.skinior.com',
    // Add your mobile app domains if needed
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200,
});
```

### 2. Environment Variables for Production
```properties
# .env - Production Settings
ALLOW_MOBILE_DEVELOPMENT=false
FRONTEND_URL="https://skinior.com"
NODE_ENV="production"
```

### 3. Additional Security Measures to Consider

#### Rate Limiting
```bash
npm install @nestjs/throttler
```

#### Helmet for Security Headers
```bash
npm install helmet
```

#### API Key Authentication (Optional)
For mobile apps, consider implementing API keys alongside JWT tokens.

### 4. Security Checklist
- [ ] Restrict CORS origins
- [ ] Set ALLOW_MOBILE_DEVELOPMENT=false
- [ ] Add rate limiting
- [ ] Enable security headers (Helmet)
- [ ] Review JWT token expiration times
- [ ] Implement proper logging for security events
- [ ] Set up HTTPS in production
- [ ] Review and limit exposed headers

### 5. Quick Security Lockdown
When ready, simply replace the CORS configuration in `main.ts` and restart the application.

**Remember**: Test thoroughly with your frontend and mobile apps after implementing security restrictions!
