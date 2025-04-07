import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getFirestore,
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
} from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache(),
  ignoreUndefinedProperties: true,
});

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

if (process.env.NODE_ENV === "development") {
  connectFirestoreEmulator(db, "localhost", 8080);
}

const storage = getStorage(firebaseApp);

if (process.env.NODE_ENV === "development") {
  connectStorageEmulator(storage, "localhost", 9199);
}

export { firebaseApp, auth, db, provider, storage, signInWithPopup, signOut };
