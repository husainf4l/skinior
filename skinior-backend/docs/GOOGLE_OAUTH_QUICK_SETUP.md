# 🚀 Quick Google OAuth Setup Guide

## Step 1: Go to Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. If you don't have a project, create one:
   - Click "Select a project" → "New Project"
   - Name: `skinior-backend`
   - Click "Create"

## Step 2: Enable Google+ API

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on **"Google+ API"**
4. Click **"Enable"**

## Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** user type
3. Fill in the form:
   - **App name**: `Skinior`
   - **User support email**: Your email
   - **Developer contact information**: Your email
   - **App domain**: `skinior.com`
   - **Authorized domains**: Add `skinior.com` and `localhost`
4. Click **"Save and Continue"**

## Step 4: Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth 2.0 Client IDs"**
3. Configure:
   - **Application type**: `Web application`
   - **Name**: `Skinior Backend`
   - **Authorized JavaScript origins**:
     - Add: `http://localhost:4008`
     - Add: `https://skinior.com`
   - **Authorized redirect URIs**:
     - Add: `http://localhost:4008/api/auth/google/callback`
     - Add: `https://skinior.com/api/auth/google/callback`
4. Click **"Create"**

## Step 5: Get Your Credentials

After creation, you'll see a popup with:

- **Client ID**: Copy this value
- **Client Secret**: Copy this value

## Step 6: Update Your .env File

Replace the placeholder values in your `.env` file:

```bash
# Replace these with your actual values from Google Cloud Console
GOOGLE_CLIENT_ID="your-actual-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
```

## Step 7: Test the Setup

1. Restart your server:

```bash
pm2 restart skinior-backend
```

2. Test the Google OAuth:

```bash
# Visit this URL in your browser
http://localhost:4008/api/auth/google
```

## 📋 What You'll Get

### Client ID Format

```
123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

### Client Secret Format

```
GOCSPX-abcdefghijklmnopqrstuvwxy
```

## 🔧 Troubleshooting

### If you get "redirect_uri_mismatch":

- Make sure `http://localhost:4008/api/auth/google/callback` is in your authorized redirect URIs

### If you get "invalid_client":

- Double-check your Client ID and Client Secret in the `.env` file

### If you get "access_denied":

- Make sure your app is published or you have test users added

## ✅ Quick Verification

After setup, test these endpoints:

```bash
# Health check
curl http://localhost:4008/api

# Google OAuth initiation
curl http://localhost:4008/api/auth/google
```

---

## 🎯 Summary

1. **Google Cloud Console** → Create project
2. **Enable Google+ API**
3. **Configure OAuth consent screen**
4. **Create OAuth 2.0 credentials**
5. **Copy Client ID and Client Secret**
6. **Update .env file**
7. **Restart server**
8. **Test the login**

Your Google OAuth will be ready! 🚀
