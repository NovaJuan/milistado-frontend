import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

import * as config from '../../config'

const firebaseConfig = {
  apiKey: config.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: config.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: config.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: config.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: config.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const firebaseApp = initializeApp(firebaseConfig)

export const db = getFirestore(firebaseApp)

export const firebaseAuth = getAuth(firebaseApp)
