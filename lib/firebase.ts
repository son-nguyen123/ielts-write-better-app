import { initializeApp, FirebaseApp, getApps } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import { getStorage, FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Validate Firebase configuration
// Note: measurementId is optional (only required for Google Analytics)
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
]

function validateFirebaseConfig() {
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  )

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingEnvVars.join(', ')}. ` +
      'Please check your .env.local file and ensure all required variables are set. ' +
      'See .env.example for the required configuration.'
    )
  }
}

// Lazy initialization of Firebase app
let app: FirebaseApp | undefined
function getApp(): FirebaseApp {
  if (!app) {
    // Validate config before initializing
    validateFirebaseConfig()
    
    // Check if Firebase is already initialized
    const existingApps = getApps()
    if (existingApps.length > 0) {
      app = existingApps[0]
    } else {
      app = initializeApp(firebaseConfig)
    }
  }
  return app
}

// Lazy getters for Firebase services
let _auth: Auth | undefined
let _db: Firestore | undefined
let _storage: FirebaseStorage | undefined

export const auth: Auth = new Proxy({} as Auth, {
  get(target, prop) {
    if (!_auth) {
      _auth = getAuth(getApp())
    }
    return Reflect.get(_auth, prop)
  }
})

export const db: Firestore = new Proxy({} as Firestore, {
  get(target, prop) {
    if (!_db) {
      _db = getFirestore(getApp())
    }
    return Reflect.get(_db, prop)
  }
})

export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(target, prop) {
    if (!_storage) {
      _storage = getStorage(getApp())
    }
    return Reflect.get(_storage, prop)
  }
})
