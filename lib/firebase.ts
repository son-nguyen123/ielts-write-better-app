import { initializeApp, FirebaseApp, getApps } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import { getStorage, FirebaseStorage } from "firebase/storage"

// Check if Firebase environment variables are configured
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
]

function checkFirebaseConfig(): { isConfigured: boolean; missingVars: string[] } {
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  )
  return {
    isConfigured: missingEnvVars.length === 0,
    missingVars: missingEnvVars
  }
}

const configCheck = checkFirebaseConfig()
const isFirebaseConfigured = configCheck.isConfigured

// Use placeholder values if environment variables are not set
// This allows the app to build and run without Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "placeholder.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "placeholder-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "placeholder.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

function getFirebaseConfigError(): Error {
  return new Error(
    `Firebase is not configured. Missing required environment variables: ${configCheck.missingVars.join(', ')}. ` +
    'Please check your .env.local file and ensure all required variables are set. ' +
    'See .env.example for the required configuration.'
  )
}

// Lazy initialization of Firebase app
let app: FirebaseApp | undefined
let initializationError: Error | undefined

function getApp(): FirebaseApp {
  if (!app && !initializationError) {
    try {
      // Only initialize if properly configured
      if (!isFirebaseConfigured) {
        initializationError = getFirebaseConfigError()
        throw initializationError
      }
      
      // Check if Firebase is already initialized
      const existingApps = getApps()
      if (existingApps.length > 0) {
        app = existingApps[0]
      } else {
        app = initializeApp(firebaseConfig)
      }
    } catch (error) {
      initializationError = error as Error
      throw error
    }
  }
  
  if (initializationError) {
    throw initializationError
  }
  
  return app!
}

// Lazy getters for Firebase services
let _auth: Auth | undefined
let _db: Firestore | undefined
let _storage: FirebaseStorage | undefined

export const auth: Auth = new Proxy({} as Auth, {
  get(target, prop) {
    // Check if Firebase is configured before attempting to use it
    if (!isFirebaseConfigured) {
      throw getFirebaseConfigError()
    }
    if (!_auth) {
      _auth = getAuth(getApp())
    }
    return Reflect.get(_auth, prop)
  }
})

export const db: Firestore = new Proxy({} as Firestore, {
  get(target, prop) {
    // Check if Firebase is configured before attempting to use it
    if (!isFirebaseConfigured) {
      throw getFirebaseConfigError()
    }
    if (!_db) {
      _db = getFirestore(getApp())
    }
    return Reflect.get(_db, prop)
  }
})

export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(target, prop) {
    // Check if Firebase is configured before attempting to use it
    if (!isFirebaseConfigured) {
      throw getFirebaseConfigError()
    }
    if (!_storage) {
      _storage = getStorage(getApp())
    }
    return Reflect.get(_storage, prop)
  }
})

// Export configuration status for use in components
export { isFirebaseConfigured }
