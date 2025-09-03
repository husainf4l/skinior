import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import GoogleSignIn
import Firebase
import FirebaseMessaging
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Configure Firebase first
    FirebaseApp.configure()
    
    // Set messaging delegate
    Messaging.messaging().delegate = self
    
    // Configure push notifications
    UNUserNotificationCenter.current().delegate = self
    
    // Request notification permissions on app start
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, error in
      print("Push notification permission granted: \(granted)")
      if let error = error {
        print("Push notification permission error: \(error.localizedDescription)")
      }
      
      if granted {
        DispatchQueue.main.async {
          UIApplication.shared.registerForRemoteNotifications()
        }
      }
    }
    
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "skiniorf",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return GIDSignIn.sharedInstance.handle(url)
  }
  
  // MARK: - Push Notification Delegate Methods
  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    print("Successfully registered for remote notifications")
    let tokenString = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
    print("APNS Device token: \(tokenString)")
    
    // Set APNS token for Firebase Messaging - this is critical
    print("Setting APNS token in Firebase Messaging...")
    Messaging.messaging().apnsToken = deviceToken
    print("APNS token set in Firebase Messaging successfully")
    
    // Also try to get FCM token immediately after setting APNS token
    Messaging.messaging().token { token, error in
      if let error = error {
        print("Error fetching FCM token after APNS token set: \(error)")
      } else if let token = token {
        print("FCM token retrieved after APNS token set: \(token)")
        UserDefaults.standard.set(token, forKey: "fcmToken")
      }
    }
  }
  
  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("Failed to register for remote notifications: \(error.localizedDescription)")
    print("APNS registration error details: \(error)")
    
    // This is critical - without APNS token, FCM won't work
    print("Unable to get APNS token - FCM will not work until this is resolved")
    print("Possible causes:")
    print("1. Running on iOS Simulator (APNS only works on physical devices)")
    print("2. Missing or incorrect push notification entitlements")
    print("3. Network connectivity issues")
    print("4. Apple Push Notification service issues")
  }
  
  // MARK: - Firebase Messaging Delegate Methods
  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    print("Firebase registration token: \(String(describing: fcmToken))")
    
    if let token = fcmToken {
      // Store the token or send it to your server
      UserDefaults.standard.set(token, forKey: "fcmToken")
    }
  }
  
  // Handle notification when app is in foreground
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.banner, .sound, .badge])
  }
  
  // Handle notification tap
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    completionHandler()
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
