# Apple Developer Team ID Setup Guide

## ✅ Your Team ID Found!

Based on your development certificates, your **Team ID** is: **`T5S8MB43FJ`**

This 10-character string uniquely identifies your Apple Developer Program account.

## What is a Team ID?

Your **Team ID** is a 10-character string that uniquely identifies your Apple Developer Program account. It's required for:

- ✅ Apple Sign-In configuration
- ✅ App Store Connect submissions
- ✅ Push notifications
- ✅ In-app purchases
- ✅ Other Apple services

## How Your Team ID Was Found

Your Team ID was extracted from your Apple Development certificate:

```
Apple Development: Al-hussein Qasem Abdullah (T5S8MB43FJ)
```

The Team ID appears in parentheses after your name in the certificate.

### Method 1: Apple Developer Console (Recommended)

1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Sign in with your Apple ID
3. Look at the top-right corner - you'll see your **Team Name**
4. Click on your Team Name to see the **Team ID** (10 characters)

### Method 2: Xcode

1. Open your project in Xcode
2. Select your project in the Project Navigator
3. Select your target
4. Go to "Signing & Capabilities"
5. Your Team ID will be shown next to your team name

### Method 3: Keychain (Advanced)

1. Open Keychain Access on your Mac
2. Search for "Developer ID"
3. Look at the certificate details - Team ID is in the "Organizational Unit" field

## Setting Up Your Team ID in Xcode

### Step 1: Open Project in Xcode

```bash
cd /Users/al-husseinabdullah/skinior/skiniorna/ios
open skiniorna.xcworkspace
```

### Step 2: Configure Signing

1. Select your project in the Project Navigator
2. Select the "skiniorna" target
3. Go to "Signing & Capabilities" tab
4. Check "Automatically manage signing"
5. Select your Apple Developer account
6. Choose your team from the dropdown

### Step 3: Verify Bundle Identifier

Your bundle identifier should be: `com.skinior.skiniorna`

### Step 4: Add Apple Sign-In Capability

1. In "Signing & Capabilities" tab
2. Click "+" button
3. Search for "Sign In with Apple"
4. Add the capability

## Apple Sign-In Service Configuration

### Step 1: Create App ID

1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Go to "Certificates, Identifiers & Profiles"
3. Click "Identifiers" > "+"
4. Select "App IDs"
5. Choose "App"
6. Fill in:
   - **Description**: "Skinior Mobile App"
   - **Bundle ID**: `com.skinior.skiniorna`
   - **Team ID**: Your 10-character Team ID

### Step 2: Enable Sign In with Apple

1. In the App ID configuration
2. Check "Sign In with Apple"
3. Save the App ID

### Step 3: Create Service ID (for Web Integration)

1. Go to "Identifiers" > "+"
2. Select "Services IDs"
3. Fill in:
   - **Description**: "Skinior Web Service"
   - **Identifier**: `com.skinior.web` (or your domain)
4. Enable "Sign In with Apple"
5. Configure return URLs for your web app

## Environment Configuration

Once you have your Team ID, update your `.env` file:

```env
# Apple Sign-In Configuration
APPLE_SERVICE_ID=com.skinior.web  # Your service ID from Apple Developer Console
```

## Testing Apple Sign-In

1. Build and run your app on a real iOS device (simulator won't work for Apple Sign-In)
2. Try the Apple Sign-In button
3. Check console for any errors

## Common Issues

### "Invalid Team ID"

- Make sure you're using the 10-character Team ID, not the team name
- Verify your Apple Developer Program membership is active

### "Sign In with Apple not available"

- Test on a real iOS device, not simulator
- Ensure your app has the correct bundle identifier
- Verify Apple Sign-In capability is enabled

### "Service ID not configured"

- Create the Service ID in Apple Developer Console
- Configure the correct return URLs
- Update your `.env` file with the correct service ID

## Need Help?

If you can't find your Team ID:

1. Check your Apple Developer Program membership
2. Contact Apple Developer Support
3. Ask your team admin if you're part of an organization account
