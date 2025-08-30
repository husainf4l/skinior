# 🔐 Google Cloud Console Setup for Skinior OAuth

## Step-by-Step Guide to Configure Google OAuth

### Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. If you don't have a project, create one:
   - Click "Select a project" → "New Project"
   - Name: `skinior-backend`
   - Location: Leave as default
   - Click "Create"

### Step 2: Enable Google+ API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on **"Google+ API"**
4. Click **"Enable"**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth 2.0 Client IDs"**

### Step 4: Configure OAuth Consent Screen

1. If prompted, click **"Configure Consent Screen"**
2. Choose **"External"** user type
3. Fill in the OAuth consent screen:
   - **App name**: `Skinior`
   - **User support email**: Your email
   - **Developer contact information**: Your email
   - **App logo**: (Optional) Upload your app logo
   - **App domain**: `skinior.com` (for production)
   - **Authorized domains**: Add `skinior.com` and `localhost` (for development)
4. Click **"Save and Continue"**

### Step 5: Create OAuth Client ID

1. Go back to **"Credentials"** page
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth 2.0 Client IDs"**
3. Configure the OAuth client:
   - **Application type**: `Web application`
   - **Name**: `Skinior Backend`
   - **Authorized JavaScript origins**:
     - Add: `http://localhost:4008` (for development)
     - Add: `https://skinior.com` (for production)
   - **Authorized redirect URIs**:
     - Add: `http://localhost:4008/api/auth/google/callback` (for development)
     - Add: `https://skinior.com/api/auth/google/callback` (for production)
4. Click **"Create"**

### Step 6: Get Your Credentials

1. After creation, you'll see a popup with:
   - **Client ID**: Copy this value
   - **Client Secret**: Copy this value
2. You can also find these in the **"Credentials"** page by clicking on your OAuth client

### Step 7: Update Your Environment Variables

1. Open your `.env` file
2. Replace the placeholder values:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-actual-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
GOOGLE_CALLBACK_URL="http://localhost:4008/api/auth/google/callback"
```

### Step 8: Test the Setup

1. Restart your NestJS server:

```bash
npm run start:dev
```

2. Test the Google OAuth flow:
   - Visit: `http://localhost:4008/api/auth/google`
   - You should be redirected to Google for authentication
   - After login, you should be redirected back to your frontend

## 🔧 Troubleshooting

### Common Issues:

#### 1. "redirect_uri_mismatch"

- **Cause**: The redirect URI in Google Cloud doesn't match your callback URL
- **Solution**: Ensure `http://localhost:4008/api/auth/google/callback` is added to authorized redirect URIs

#### 2. "invalid_client"

- **Cause**: Wrong Client ID or Secret
- **Solution**: Double-check your credentials in `.env` file

#### 3. "access_denied"

- **Cause**: User denied permissions or app is in testing mode
- **Solution**: Add test users in OAuth consent screen or publish the app

#### 4. CORS Issues

- **Cause**: Frontend can't communicate with backend
- **Solution**: Ensure CORS is properly configured in `main.ts`

## 📋 Production Deployment

### For Production Environment:

1. **Update Authorized Origins**:
   - Add your production domain: `https://skinior.com`
   - Add your production API URL: `https://api.skinior.com`

2. **Update Callback URL**:

   ```bash
   GOOGLE_CALLBACK_URL="https://api.skinior.com/api/auth/google/callback"
   ```

3. **Update Frontend URL**:

   ```bash
   FRONTEND_URL="https://skinior.com"
   ```

4. **OAuth Consent Screen**:
   - Add `skinior.com` to authorized domains
   - Upload proper app logo and branding
   - Consider publishing the app for public use

## 🔒 Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate credentials** periodically
4. **Monitor API usage** in Google Cloud Console
5. **Restrict API scopes** to only what's needed (email, profile)

## 📞 Support

If you encounter issues:

1. Check the [Google OAuth 2.0 documentation](https://developers.google.com/identity/protocols/oauth2)
2. Verify your credentials in Google Cloud Console
3. Check server logs for detailed error messages
4. Ensure your frontend and backend are running on the correct ports

---

## ✅ Quick Verification

After setup, test these endpoints:

```bash
# Health check
curl http://localhost:4008/api

# Google OAuth initiation
curl http://localhost:4008/api/auth/google
```

Your Google OAuth should now be fully configured! 🎉
