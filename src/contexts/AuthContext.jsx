import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create admin account if it doesn't exist
  useEffect(() => {
    const createAdminAccount = async () => {
      try {
        await createUserWithEmailAndPassword(auth, 'admin@designluka.com', 'admin123');
      } catch (error) {
        // If user already exists, ignore the error
        if (error.code !== 'auth/email-already-in-use') {
          console.error('Error creating admin account:', error);
        }
      }
    };

    createAdminAccount();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    currentUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 