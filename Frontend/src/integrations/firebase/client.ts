import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "student-management-syste-4294b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "student-management-syste-4294b",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "student-management-syste-4294b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "733920580527",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:733920580527:web:cf243c735f4098b028555a",
};

const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);
