# 🔐 Skinior Backend Authentication Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication Methods](#authentication-methods)
3. [JWT Token System](#jwt-token-system)
4. [Google OAuth Flow](#google-oauth-flow)
5. [API Endpoints](#api-endpoints)
6. [Environment Configuration](#environment-configuration)
7. [Security Features](#security-features)
8. [Usage Examples](#usage-examples)
9. [Error Handling](#error-handling)
10. [Testing](#testing)

## Overview

The Skinior backend implements a robust authentication system that supports multiple authentication methods:
- **Email/Password Authentication** with JWT tokens
- **Google OAuth 2.0** integration
- **Refresh Token** mechanism for secure token renewal
- **Password Hashing** using bcrypt
- **Route Protection** with Guards

## Authentication Methods

### 1. Email/Password Authentication
Traditional authentication where users register with email and password.

**Features:**
- Password hashing with bcrypt (12 rounds)
- Email uniqueness validation
- JWT token generation
- Refresh token support

### 2. Google OAuth 2.0
Seamless authentication using Google accounts.

**Features:**
- No password required
- Automatic profile data import
- Secure token exchange
- Account linking with existing emails

## JWT Token System

### Token Types

| Token Type | Purpose | Lifespan | Storage |
|------------|---------|----------|---------|
| **Access Token** | API authentication | 7 days | Client-side (memory/secure storage) |
| **Refresh Token** | Token renewal | 30 days | Database + Client-side |

### Token Structure

**Access Token Payload:**
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "iat": 1693420800,
  "exp": 1694025600
}
```

**Refresh Token Payload:**
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "iat": 1693420800,
  "exp": 1696012800
}
```

### Token Security
- **Signed with HS256** algorithm
- **Different secrets** for access and refresh tokens
- **Refresh tokens stored in database** for revocation
- **Automatic cleanup** of expired tokens

## Google OAuth Flow

### Step-by-Step Process

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Google
    participant Database

    User->>Frontend: Click "Sign in with Google"
    Frontend->>Backend: GET /auth/google
    Backend->>Google: Redirect to Google OAuth
    Google->>User: Show consent screen
    User->>Google: Grant permissions
    Google->>Backend: GET /auth/google/callback?code=AUTH_CODE
    Backend->>Google: Exchange code for tokens
    Google->>Backend: Return access_token & user profile
    Backend->>Database: Create/update user
    Backend->>Database: Store refresh token
    Backend->>Frontend: Redirect with JWT tokens
    Frontend->>User: Authentication complete
```

### Code Implementation

**Google Strategy (`google.strategy.ts`):**
```typescript
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    try {
      // Find or create user
      let user = await this.userService.findUserByGoogleId(profile.id);
      
      if (!user) {
        user = await this.userService.createGoogleUser(profile);
      }
      
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
```

## API Endpoints

### Authentication Endpoints

#### 1. Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "clm2...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2025-08-30T16:03:43.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 2. Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "clm2...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### 3. Google OAuth Initiation
```http
GET /auth/google
```
*Redirects to Google OAuth consent screen*

#### 4. Google OAuth Callback
```http
GET /auth/google/callback?code=AUTHORIZATION_CODE
```
*Handles Google OAuth callback and redirects to frontend with tokens*

#### 5. Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 6. Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### 7. Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "clm2...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://...",
  "createdAt": "2025-08-30T16:03:43.000Z"
}
```

### User Endpoints

#### 1. Get User Profile
```http
GET /users/profile
Authorization: Bearer <access_token>
```

#### 2. Update User Profile
```http
PUT /users/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "avatar": "https://example.com/avatar.jpg"
}
```

## Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/skinior"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_REFRESH_EXPIRES_IN="30d"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"

# Frontend URL
FRONTEND_URL="http://localhost:3007"

# Security
BCRYPT_ROUNDS=12
```

### Setting up Google OAuth

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select existing one
3. **Enable Google+ API**
4. **Create OAuth 2.0 credentials:**
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
5. **Copy Client ID and Client Secret** to your `.env` file

## Security Features

### Password Security
- **bcrypt hashing** with 12 rounds
- **No plaintext passwords** stored
- **Password validation** on login

### Token Security
- **Different secrets** for access and refresh tokens
- **Short-lived access tokens** (7 days)
- **Refresh token rotation** on each use
- **Token revocation** on logout

### Route Protection
```typescript
// Protect routes with JWT Guard
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Req() req) {
  return req.user;
}
```

### CORS Configuration
```typescript
// In main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

## Usage Examples

### Frontend Integration (React/Next.js)

#### 1. Login with Email/Password
```javascript
const login = async (email, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const { user, tokens } = await response.json();
    
    // Store tokens securely
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    
    return user;
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

#### 2. Google OAuth
```javascript
// Redirect to Google OAuth
const loginWithGoogle = () => {
  window.location.href = '/api/auth/google';
};

// Handle callback (in a callback component)
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    localStorage.setItem('accessToken', token);
    // Redirect to dashboard
  }
}, []);
```

#### 3. API Requests with Authentication
```javascript
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (response.status === 401) {
    // Token expired, try to refresh
    await refreshToken();
    // Retry request
  }
  
  return response;
};
```

#### 4. Token Refresh
```javascript
const refreshToken = async () => {
  const refresh = localStorage.getItem('refreshToken');
  
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    
    const { accessToken, refreshToken: newRefresh } = await response.json();
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefresh);
    
    return accessToken;
  } catch (error) {
    // Refresh failed, redirect to login
    localStorage.clear();
    window.location.href = '/login';
  }
};
```

## Error Handling

### Common Error Responses

#### 1. Validation Errors (400)
```json
{
  "statusCode": 400,
  "message": [
    "email must be a valid email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

#### 2. Unauthorized (401)
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

#### 3. Conflict (409)
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

#### 4. Token Expired (401)
```json
{
  "statusCode": 401,
  "message": "Token expired",
  "error": "Unauthorized"
}
```

### Error Handling in Frontend
```javascript
const handleApiError = (error) => {
  switch (error.status) {
    case 400:
      // Show validation errors
      showValidationErrors(error.message);
      break;
    case 401:
      // Redirect to login or refresh token
      if (error.message.includes('expired')) {
        refreshToken();
      } else {
        redirectToLogin();
      }
      break;
    case 409:
      // Show conflict message
      showMessage('User already exists');
      break;
    default:
      showMessage('Something went wrong');
  }
};
```

## Testing

### Unit Tests Example
```typescript
describe('AuthService', () => {
  it('should create user with hashed password', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
    };
    
    const user = await authService.register(userData);
    
    expect(user.email).toBe(userData.email);
    expect(user.password).toBeUndefined(); // Should not return password
  });
  
  it('should generate valid JWT tokens', async () => {
    const user = { id: '1', email: 'test@example.com' };
    const tokens = await authService.generateTokens(user);
    
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    
    // Verify token payload
    const payload = jwt.verify(tokens.accessToken, JWT_SECRET);
    expect(payload.sub).toBe(user.id);
    expect(payload.email).toBe(user.email);
  });
});
```

### Integration Tests
```typescript
describe('Auth Controller (e2e)', () => {
  it('POST /auth/register', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
    };
    
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);
    
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.tokens.accessToken).toBeDefined();
  });
  
  it('GET /auth/me with valid token', async () => {
    const token = 'valid-jwt-token';
    
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    
    expect(response.body.email).toBeDefined();
  });
});
```

## Best Practices

### Security Best Practices
1. **Use HTTPS in production**
2. **Store tokens securely** (httpOnly cookies or secure storage)
3. **Implement rate limiting** for auth endpoints
4. **Validate all inputs** thoroughly
5. **Use strong JWT secrets** (256-bit minimum)
6. **Rotate refresh tokens** on each use
7. **Implement proper CORS** configuration

### Performance Best Practices
1. **Cache user data** to reduce database queries
2. **Use connection pooling** for database
3. **Implement proper indexing** on email and googleId fields
4. **Use Redis for session storage** in production
5. **Implement proper logging** for monitoring

### Development Best Practices
1. **Use environment variables** for all configuration
2. **Write comprehensive tests** for auth flows
3. **Document all endpoints** clearly
4. **Use TypeScript** for type safety
5. **Implement proper error handling** at all levels

---

## Conclusion

This authentication system provides a robust, secure, and scalable foundation for the Skinior platform. It supports multiple authentication methods, implements security best practices, and is designed for easy integration with frontend applications.

For questions or issues, please refer to the API documentation or contact the development team.
