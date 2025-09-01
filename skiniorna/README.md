# Skinior Mobile App

A React Native mobile application for the Skinior skincare platform. This is the **mobile-only** companion to the Next.js web application.

## 🏗️ Architecture

- **Mobile App**: React Native (iOS & Android)
- **Web App**: Next.js (separate repository)
- **Shared Backend**: Unified API serving both mobile and web clients
- **Unified Authentication**: Same user accounts across all platforms

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- React Native development environment
- iOS: Xcode 15+ (for iOS development)
- Android: Android Studio (for Android development)

### Environment Setup

1. **Clone the repository**

   ```sh
   git clone <repository-url>
   cd skiniorna
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Environment Configuration**

   ```sh
   # Run the setup script (recommended)
   ./setup-env.sh

   # OR manually copy and edit
   cp .env.example .env
   nano .env
   ```

4. **iOS Setup** (if developing for iOS)

   ```sh
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

   **Important**: Your iOS bundle identifier is set to `com.skinior.skiniorna`

### Authentication Setup

This app uses unified authentication with your Next.js web app:

1. **Google OAuth**: Use the same Web Client ID as your web app
2. **Apple Sign-In**: Configure iOS entitlements and use shared service ID
3. **Backend API**: Ensure your API supports both mobile and web auth flows

📖 **Setup Guides**:

- [Google Sign-In Setup](./GOOGLE_SETUP_GUIDE.md)
- [Apple Team ID Setup](./APPLE_TEAM_ID_GUIDE.md)

### Running the App

```sh
# Start Metro bundler
npm start

# iOS
npm run ios

# Android
npm run android
```

## 🔧 Configuration

### Environment Variables

| Variable               | Description                | Source                  |
| ---------------------- | -------------------------- | ----------------------- |
| `API_BASE_URL`         | Shared backend API URL     | Your API server         |
| `GOOGLE_WEB_CLIENT_ID` | Google OAuth Web Client ID | Google Cloud Console    |
| `GOOGLE_IOS_CLIENT_ID` | Google OAuth iOS Client ID | Google Cloud Console    |
| `APPLE_SERVICE_ID`     | Apple Sign-In Service ID   | Apple Developer Console |

### iOS Specific Setup

1. Update `ios/skiniorna/Info.plist` with your actual Google iOS Client ID
2. Ensure Apple Sign-In entitlements are properly configured
3. Add your app to Apple Developer Console for Sign-In capability

## 📱 Features

- Unified authentication (Email, Google, Apple)
- Cross-platform compatibility (iOS & Android)
- Shared user accounts with web app
- Secure token management
- Theme support (Dark/Light mode)

## 🔗 Related Projects

- **Web App**: [Skinior Next.js](https://github.com/your-org/skinior-web) - Next.js web application
- **API**: [Skinior API](https://github.com/your-org/skinior-api) - Backend API server

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
