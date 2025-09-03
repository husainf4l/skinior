import { initializeApp, getApps } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getMessaging } from '@react-native-firebase/messaging';
import { getFirestore } from '@react-native-firebase/firestore';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_DATABASE_URL,
} from '@env';

// Suppress deprecation warnings during migration
(globalThis as any).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

// Note: Strict mode disabled as migration is complete
// (globalThis as any).RNFB_MODULAR_DEPRECATION_STRICT_MODE = true;

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID || undefined,
  databaseURL: FIREBASE_DATABASE_URL,
};

// Initialize Firebase
let app: any = null;
let auth: any = null;
let messaging: any = null;
let firestore: any = null;

const initializeFirebase = async () => {
  try {
    // Check if app is already initialized using getApps()
    const apps = getApps();
    if (apps.length > 0) {
      app = apps[0];
      console.log('Firebase app already initialized, using existing instance');
    } else {
      console.log('Initializing Firebase app...');
      app = await initializeApp(firebaseConfig);
      console.log('Firebase app initialized successfully');
    }

    // Initialize services if not already done
    if (!auth) auth = getAuth(app);
    if (!messaging) messaging = getMessaging(app);
    if (!firestore) firestore = getFirestore(app);

    console.log('All Firebase services initialized successfully');
    return { app, auth, messaging, firestore };
  } catch (error: any) {
    console.error('Failed to initialize Firebase:', error);
    throw error;
  }
};

// Export initialization function and services
export { initializeFirebase };
export { app, auth, messaging, firestore };
