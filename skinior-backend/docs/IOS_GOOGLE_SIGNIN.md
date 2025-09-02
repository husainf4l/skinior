# Google Sign-In for iOS Mobile App

## Overview
Your Skinior backend already supports mobile Google authentication! The endpoint `POST /api/auth/google/token` is ready to receive Google ID tokens from your iOS app.

## iOS Implementation Guide

### 1. Install Google Sign-In SDK

#### Using CocoaPods
Add to your `Podfile`:
```ruby
pod 'GoogleSignIn'
```

#### Using Swift Package Manager
1. Open Xcode → File → Add Package Dependencies
2. Add: `https://github.com/google/GoogleSignIn-iOS`

### 2. Configure Google Services

#### Download Configuration File
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create one)
3. Go to APIs & Services → Credentials
4. Download `GoogleService-Info.plist`
5. Add it to your Xcode project

#### Your Current Google OAuth Settings
```
Web Client ID: 648525943119-4hnshon7rt3hm9qkf2or13jslqsaqgvv.apps.googleusercontent.com
iOS Client ID: 648525943119-g32q59jkiv5cpn8egov15snaflium0ue.apps.googleusercontent.com
```

**Important**: Use the iOS Client ID in your iOS app configuration!

### 3. iOS App Configuration

#### Configure URL Scheme
In your `Info.plist`, add:
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>GoogleSignIn</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.648525943119-g32q59jkiv5cpn8egov15snaflium0ue</string>
        </array>
    </dict>
</array>
```

#### App Delegate Setup (Swift)
```swift
import GoogleSignIn
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Configure Google Sign-In
        guard let path = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist"),
              let plist = NSDictionary(contentsOfFile: path),
              let clientId = plist["CLIENT_ID"] as? String else {
            fatalError("GoogleService-Info.plist not found or CLIENT_ID missing")
        }
        
        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: clientId)
        
        return true
    }
    
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        return GIDSignIn.sharedInstance.handle(url)
    }
}
```

#### For SwiftUI Scene Delegate
```swift
import GoogleSignIn
import SwiftUI

@main
struct SkiniorApp: App {
    
    init() {
        configureGoogleSignIn()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .onOpenURL { url in
                    GIDSignIn.sharedInstance.handle(url)
                }
        }
    }
    
    private func configureGoogleSignIn() {
        guard let path = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist"),
              let plist = NSDictionary(contentsOfFile: path),
              let clientId = plist["CLIENT_ID"] as? String else {
            fatalError("GoogleService-Info.plist not found or CLIENT_ID missing")
        }
        
        GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: clientId)
    }
}
```

### 4. Implementation Code

#### Google Sign-In Service
```swift
import GoogleSignIn
import UIKit

class GoogleSignInService: ObservableObject {
    @Published var isSignedIn = false
    @Published var user: GIDGoogleUser?
    
    private let apiBaseURL = "http://YOUR_IP:4008/api" // Replace with your backend IP
    
    func signIn() {
        guard let presentingViewController = UIApplication.shared.windows.first?.rootViewController else {
            print("No presenting view controller found")
            return
        }
        
        GIDSignIn.sharedInstance.signIn(withPresenting: presentingViewController) { [weak self] result, error in
            if let error = error {
                print("Google Sign-In error: \(error.localizedDescription)")
                return
            }
            
            guard let user = result?.user,
                  let idToken = user.idToken?.tokenString else {
                print("Failed to get Google ID token")
                return
            }
            
            self?.user = user
            self?.sendTokenToBackend(idToken: idToken)
        }
    }
    
    private func sendTokenToBackend(idToken: String) {
        guard let url = URL(string: "\(apiBaseURL)/auth/google/ios/token") else {
            print("Invalid URL")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["token": idToken]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        } catch {
            print("Failed to encode request body: \(error)")
            return
        }
        
        URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            if let error = error {
                print("Network error: \(error.localizedDescription)")
                return
            }
            
            guard let data = data else {
                print("No data received")
                return
            }
            
            do {
                let authResponse = try JSONDecoder().decode(AuthResponse.self, from: data)
                DispatchQueue.main.async {
                    self?.handleSuccessfulAuth(authResponse)
                }
            } catch {
                print("Failed to decode response: \(error)")
            }
        }.resume()
    }
    
    private func handleSuccessfulAuth(_ authResponse: AuthResponse) {
        // Store tokens securely (use Keychain in production)
        UserDefaults.standard.set(authResponse.tokens.accessToken, forKey: "access_token")
        UserDefaults.standard.set(authResponse.tokens.refreshToken, forKey: "refresh_token")
        
        self.isSignedIn = true
        print("Google Sign-In successful!")
        print("User: \(authResponse.user.email)")
    }
    
    func signOut() {
        GIDSignIn.sharedInstance.signOut()
        UserDefaults.standard.removeObject(forKey: "access_token")
        UserDefaults.standard.removeObject(forKey: "refresh_token")
        self.isSignedIn = false
        self.user = nil
    }
}

// Response models
struct AuthResponse: Codable {
    let user: User
    let tokens: Tokens
}

struct User: Codable {
    let id: String
    let email: String
    let name: String?
    let profilePicture: String?
}

struct Tokens: Codable {
    let accessToken: String
    let refreshToken: String
}
```

#### SwiftUI View Implementation
```swift
import SwiftUI

struct LoginView: View {
    @StateObject private var googleSignIn = GoogleSignInService()
    
    var body: some View {
        VStack(spacing: 20) {
            if googleSignIn.isSignedIn {
                Text("Welcome!")
                    .font(.title)
                
                if let user = googleSignIn.user {
                    Text("Signed in as: \(user.profile?.email ?? "Unknown")")
                        .foregroundColor(.secondary)
                }
                
                Button("Sign Out") {
                    googleSignIn.signOut()
                }
                .foregroundColor(.red)
            } else {
                Text("Skinior")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Button(action: {
                    googleSignIn.signIn()
                }) {
                    HStack {
                        Image(systemName: "globe")
                        Text("Sign in with Google")
                    }
                    .foregroundColor(.white)
                    .padding()
                    .background(Color.blue)
                    .cornerRadius(8)
                }
            }
        }
        .padding()
    }
}
```

### 5. UIKit Implementation (Alternative)

If you're using UIKit instead of SwiftUI:

```swift
import UIKit
import GoogleSignIn

class LoginViewController: UIViewController {
    
    @IBOutlet weak var signInButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupGoogleSignInButton()
    }
    
    private func setupGoogleSignInButton() {
        signInButton.addTarget(self, action: #selector(signInWithGoogle), for: .touchUpInside)
    }
    
    @objc private func signInWithGoogle() {
        GIDSignIn.sharedInstance.signIn(withPresenting: self) { [weak self] result, error in
            if let error = error {
                print("Google Sign-In error: \(error.localizedDescription)")
                return
            }
            
            guard let user = result?.user,
                  let idToken = user.idToken?.tokenString else {
                print("Failed to get Google ID token")
                return
            }
            
            self?.sendTokenToBackend(idToken: idToken)
        }
    }
    
    private func sendTokenToBackend(idToken: String) {
        // Same implementation as above
    }
}
```

### 6. Security Best Practices

#### Store Tokens Securely
```swift
import Security

class KeychainService {
    static func save(key: String, data: Data) -> OSStatus {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data
        ]
        
        SecItemDelete(query as CFDictionary)
        return SecItemAdd(query as CFDictionary, nil)
    }
    
    static func load(key: String) -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: kCFBooleanTrue!,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var dataTypeRef: AnyObject? = nil
        let status: OSStatus = SecItemCopyMatching(query as CFDictionary, &dataTypeRef)
        
        if status == noErr {
            return dataTypeRef as? Data
        } else {
            return nil
        }
    }
    
    static func delete(key: String) -> OSStatus {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key
        ]
        
        return SecItemDelete(query as CFDictionary)
    }
}

// Usage
if let tokenData = "your_access_token".data(using: .utf8) {
    KeychainService.save(key: "access_token", data: tokenData)
}
```

### 7. API Endpoints Available

Your backend provides these endpoints for mobile:

#### Google Authentication
```
POST /api/auth/google/ios/token     - iOS Google Sign-In (recommended)
POST /api/auth/google/token         - Web Google Sign-In
POST /api/auth/google/token/test    - Test endpoint for debugging
Body: { "token": "GOOGLE_ID_TOKEN" }
Response: { "user": {...}, "tokens": {...} }
```

#### Other Auth Endpoints
```
POST /api/auth/login          - Email/password login
POST /api/auth/register       - Create account
POST /api/auth/refresh        - Refresh JWT tokens
POST /api/auth/logout         - Logout
GET  /api/auth/me            - Get current user
```

### 8. Testing

#### Test the Integration
1. Run your iOS app
2. Tap "Sign in with Google"
3. Complete Google authentication
4. Check your backend logs to see the token verification
5. Verify the user is created/logged in

#### Debug Tips
- Check your Google Cloud Console for proper iOS app configuration
- Ensure your bundle ID matches the one in Google Console
- Verify the CLIENT_ID in GoogleService-Info.plist
- Check backend logs for any token verification errors

### 9. Production Considerations

1. **Bundle ID**: Make sure your production bundle ID is registered in Google Console
2. **App Store**: Include privacy descriptions for Google Sign-In
3. **Backend**: Your backend IP should be replaced with your production domain
4. **HTTPS**: Use HTTPS in production (https://api.skinior.com)

Your backend is ready! Just implement the iOS client code and you'll have Google Sign-In working. 🚀
