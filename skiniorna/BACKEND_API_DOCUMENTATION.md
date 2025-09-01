# Backend API Documentation for Skinior Mobile App

## Google OAuth Authentication

### Endpoint: `POST /api/auth/google`

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIs...", // Required: Google ID Token
  "serverAuthCode": "4/P7q7W91...", // Optional: Server authorization code
  "user": {
    // Required: User information from Google
    "email": "user@example.com", // Required: User's email
    "name": "John Doe", // Required: User's full name
    "picture": "https://...", // Optional: Profile picture URL
    "id": "1234567890" // Required: Google user ID
  }
}
```

### Example Request

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY4YzNkN...",
  "serverAuthCode": "4/P7q7W91a-oMsCeLvIaQm6bTrgtp7",
  "user": {
    "email": "john.doe@gmail.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/a-/AOh14Gi...",
    "id": "1234567890123456789"
  }
}
```

### Backend Implementation Notes

1. **ID Token Verification**:

   - Verify the `idToken` with Google's public keys
   - Extract user information from the verified token
   - Ensure the token's `aud` claim matches your Google Client ID

2. **Server Auth Code** (Optional):

   - Use this to exchange for access/refresh tokens on the server side
   - Only needed if you plan to access Google APIs on behalf of the user

3. **User Data**:
   - Use the verified token data, not just the user object from the request
   - Create or update user record in your database
   - Generate your own JWT token for the mobile app

### Expected Response

```json
{
  "success": true,
  "token": "your_jwt_token_here",
  "user": {
    "id": "user_id_in_your_db",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://..."
    // ... other user fields
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid ID token",
  "error": "INVALID_TOKEN"
}
```

## Apple Sign-In Authentication

### Endpoint: `POST /api/auth/apple`

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
  "identityToken": "eyJhbGciOiJSUzI1NiIs...", // Required: Apple Identity Token
  "authorizationCode": "c6295d...", // Required: Authorization code
  "user": {
    // Optional: Only provided on first sign-in
    "email": "user@privaterelay.appleid.com", // May be private relay email
    "name": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Example Request

```json
{
  "identityToken": "eyJraWQiOiJBSURPUEsxIiwiYWxnIjoiUlMyNTYifQ...",
  "authorizationCode": "c6295d45e.0.mstxy.ag_T8CPcUOCBg5HMqA4-Lg",
  "user": {
    "email": "john.doe@privaterelay.appleid.com",
    "name": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

### Backend Implementation Notes

1. **Identity Token Verification**:

   - Verify the `identityToken` with Apple's public keys
   - Apple's keys are available at: `https://appleid.apple.com/auth/keys`
   - Ensure the token's `aud` claim matches your Apple Service ID
   - Check the `iss` claim is "https://appleid.apple.com"

2. **Authorization Code**:

   - Use this to get refresh tokens from Apple (if needed)
   - Exchange at: `https://appleid.apple.com/auth/token`
   - Required for server-side token refresh

3. **User Data Handling**:

   - User info is only provided on **first sign-in**
   - On subsequent sign-ins, only `identityToken` and `authorizationCode` are provided
   - Store user data from first sign-in in your database
   - Use the `sub` claim from the verified token as the unique user identifier

4. **Privacy Considerations**:
   - Users can choose to hide their email (private relay)
   - Email format: `randomstring@privaterelay.appleid.com`
   - Always use the `sub` claim as the primary identifier, not email

### Expected Response

```json
{
  "success": true,
  "token": "your_jwt_token_here",
  "user": {
    "id": "user_id_in_your_db",
    "email": "user@privaterelay.appleid.com",
    "name": "John Doe",
    "appleId": "sub_claim_from_token"
    // ... other user fields
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid identity token",
  "error": "INVALID_APPLE_TOKEN"
}
```

### Apple Sign-In Flow Summary

1. **First Sign-In**: Client sends `identityToken`, `authorizationCode`, and `user` data
2. **Subsequent Sign-Ins**: Client sends only `identityToken` and `authorizationCode`
3. **Server Verification**: Verify token, extract `sub` claim, lookup/create user
4. **Response**: Return your JWT token for the mobile app

## Environment Variables

The mobile app expects these environment variables in `.env`:

```env
# API Configuration
API_BASE_URL=https://skinior.com/api

# Google Sign-In Configuration
GOOGLE_WEB_CLIENT_ID=648525943119-4hnshon7rt3hm9qkf2or13jslqsaqgvv.apps.googleusercontent.com
GOOGLE_IOS_CLIENT_ID=648525943119-g32q59jkiv5cpn8egov15snaflium0ue.apps.googleusercontent.com

# Apple Sign-In Configuration
APPLE_SERVICE_ID=T5S8MB43FJ.com.skinior.web

# Environment
NODE_ENV=development
```

## Security Considerations

1. **HTTPS Only**: All authentication endpoints must use HTTPS
2. **Token Verification**: Always verify ID tokens server-side
3. **Rate Limiting**: Implement rate limiting on auth endpoints
4. **CORS**: Configure CORS properly for your domain
5. **Input Validation**: Validate all input data before processing

## Quick Comparison: Google vs Apple Sign-In

| Aspect                 | Google Sign-In                               | Apple Sign-In                         |
| ---------------------- | -------------------------------------------- | ------------------------------------- |
| **Token Verification** | Google public keys                           | Apple public keys                     |
| **User Data**          | Always provided                              | Only on first sign-in                 |
| **Unique Identifier**  | Google User ID                               | `sub` claim from token                |
| **Email Privacy**      | Real email                                   | Can be private relay                  |
| **Token Refresh**      | Server auth code                             | Authorization code                    |
| **Verification URL**   | `https://www.googleapis.com/oauth2/v3/certs` | `https://appleid.apple.com/auth/keys` |

## Implementation Checklist

### For Google Sign-In:

- [ ] Verify `idToken` with Google's public keys
- [ ] Extract user info from verified token
- [ ] Store/update user in database
- [ ] Generate your JWT token
- [ ] Return user data and token

### For Apple Sign-In:

- [ ] Verify `identityToken` with Apple's public keys
- [ ] Handle first vs subsequent sign-ins differently
- [ ] Use `sub` claim as unique identifier
- [ ] Store user data from first sign-in only
- [ ] Generate your JWT token
- [ ] Return user data and token
