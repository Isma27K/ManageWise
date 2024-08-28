// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword as createUserWithEmailAndPasswordFirebase, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(firebaseApp);

// Set up Google authentication provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

// Exported functions
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore(firebaseApp);

// Reset password function
export const handlePasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return 'Check your email for the password reset link.';
  } catch (error) {
    throw new Error(`Password reset failed: ${error.message}`);
  }
};

export const createUserDocumentFromAuth = async (userAuth, additionalData = {}) => {
  if (!userAuth) return null;

  const userDocRef = doc(db, 'users', userAuth.uid);
  const userSnapShot = await getDoc(userDocRef);

  if (!userSnapShot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user document', error);
      throw error;
    }
  }

  return userDocRef;
};

export const createUserWithEmailAndPasswordCustom = async (email, password) => {
  if (!email || !password) throw new Error('Email and password are required');

  return await createUserWithEmailAndPasswordFirebase(auth, email, password);
};

export const signInAuthWithEmailAndPassword = async (email, password) => {
  if (!email || !password) throw new Error('Email and password are required');

  return await signInWithEmailAndPassword(auth, email, password);
};