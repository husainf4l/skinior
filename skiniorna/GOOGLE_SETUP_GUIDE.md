# Google Sign-In Setup Guide for React Native

## Why You Need Both Web and iOS Client IDs

### The Architecture

Google Sign-In for React Native uses a **hybrid approach**:

1. **Web Client ID**: Used by the JavaScript library for OAuth 2.0 flow
2. **iOS Client ID**: Used by iOS for native app authentication
3. **Android Client ID**: Used by Android for native app authentication (if you add Android support later)

### Why Not Just iOS Client ID?

- The `@react-native-google-signin/google-signin` library requires a web client ID for the OAuth flow
- iOS client ID is for platform-specific integration
- This is Google's standard approach for cross-platform apps

## Step-by-Step Setup

### 1. Go to Google Cloud Console

Navigate to: https://console.cloud.google.com/

### 2. Create/Select Your Project

- If you don't have a project, create one
- If you have an existing project (from your Next.js app), select it

### 3. Enable Google+ API

1. Go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it

### 4. Create OAuth 2.0 Credentials

#### Web Client ID (if not already created)

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized origins:
   - `https://skinior.com` (your production domain)
   - `http://localhost:3000` (for development)
5. Add authorized redirect URIs:
   - `https://skinior.com/auth/google/callback`
   - `http://localhost:3000/auth/google/callback`

#### iOS Client ID

1. In the same "Credentials" page
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "iOS"
4. Fill in:
   - **Name**: "Skinior iOS App"
   - **Bundle ID**: `com.skinior.skiniorna` ✅ (This is your app's bundle ID)
5. The Client ID will be generated automatically

### 5. Get Your Client IDs

#### From GoogleService-Info.plist (Easiest Method)

When you download the configuration file for iOS from Google Cloud Console:

1. **Download** `GoogleService-Info.plist` for your iOS app
2. **Open** the plist file (it's an XML file)
3. **Extract** the CLIENT_ID value

**Example plist content:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CLIENT_ID</key>
	<string>648525943119-g32q59jkiv5cpn8egov15snaflium0ue.apps.googleusercontent.com</string>
	<key>REVERSED_CLIENT_ID</key>
	<string>com.googleusercontent.apps.648525943119-g32q59jkiv5cpn8egov15snaflium0ue</string>
</dict>
</plist>
```

#### Web Client ID

- Use the same Web Client ID from your Next.js web app
- Format: `123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`

#### iOS Client ID

- Extract from the `CLIENT_ID` field in GoogleService-Info.plist
- Format: `123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`

### 6. Update Your App

1. **.env file**:

```env
GOOGLE_WEB_CLIENT_ID=your_web_client_id_here
GOOGLE_IOS_CLIENT_ID=your_ios_client_id_here
```

2. **Info.plist** (iOS):

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.googleusercontent.apps.YOUR_IOS_CLIENT_ID_LAST_PART</string>
    </array>
  </dict>
</array>
```

## Testing

1. Build and run your iOS app
2. Try Google Sign-In
3. Check console for any errors
4. Verify the OAuth flow works

## Troubleshooting

### Common Issues:

1. **"Client ID not found"**: Check that iOS client ID matches your bundle ID
2. **"Invalid scope"**: Ensure Google+ API is enabled
3. **"Redirect URI mismatch"**: Verify authorized redirect URIs in Google Console

### Debug Steps:

1. Check your bundle ID in Xcode: Project > Targets > General > Bundle Identifier
2. Verify client IDs in Google Cloud Console
3. Test with a simple web OAuth flow first

## Security Notes

- Never commit actual client IDs to version control
- Use different client IDs for development and production
- Regularly rotate your OAuth credentials
- Monitor your OAuth usage in Google Cloud Console
