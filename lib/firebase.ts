import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDkhm5eujJBqgrQf143ujz8tjM_tuxsAAc",
  authDomain: "ieltswriting-36004.firebaseapp.com",
  projectId: "ieltswriting-36004",
  storageBucket: "ieltswriting-36004.firebasestorage.app",
  messagingSenderId: "1003686782707",
  appId: "1:1003686782707:web:004e1eff8d7cb4a4443986",
  measurementId: "G-4Q1LMM63E5",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
