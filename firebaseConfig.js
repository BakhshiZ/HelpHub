/**
 * @file FirebaseConfig.js
 * @brief Configuration file for Firebase initialization.
 * @details This file initializes the Firebase app using configuration values from environment variables stored in a .env file.
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration object containing API keys and other credentials
const firebaseConfig = {
  apiKey: process.env.FIREBASE_apiKey, /**< API key for Firebase */
  authDomain: process.env.FIREBASE_authDomain, /**< Domain for Firebase authentication */
  projectId: process.env.FIREBASE_projectId, /**< ID of the Firebase project */
  storageBucket: process.env.FIREBASE_storageBucket, /**< Storage bucket for Firebase */
  messagingSenderId: process.env.FIREBASE_messagingSenderId, /**< ID for Firebase messaging service */
  appId: process.env.FIREBASE_appId, /**< ID for Firebase app */
  measurementId: process.env.FIREBASE_measurementId, /**< ID for Firebase measurement */
  databaseURL: process.env.FIREBASE_database_URL, /**< URL for Firebase Realtime Database */
};

// Initialize the Firebase app with the provided configuration
const app = initializeApp(firebaseConfig);

// Get the authentication instance for Firebase authentication
const auth = getAuth(app);

// Get the Firestore database instance for Firebase Firestore
const db = getFirestore(app);

// Export the authentication instance, app instance, and database instance for use in other modules
export { auth, app, db };
