import React, { createContext, useState } from "react";
import { app } from "../firebase/firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useEffect } from "react";
import api from "../config/api";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const ADMIN_EMAIL = "sazid98@gmail.com";
const VENDOR_EMAIL = "abrar98@gmail.com";

const AuthProviders = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password) => {
    setLoading(true);
    console.log('🔄 AuthProvider: Starting login for:', email);
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ AuthProvider: Firebase login successful');
      
      // Force admin role for specific email
      if (email === ADMIN_EMAIL) {
        console.log('🔐 Admin email detected, forcing admin role');
        setUserRole('admin');
        toast.success('Welcome Admin!', { duration: 3000 });
      }
      
      // Force vendor role for specific email
      if (email === VENDOR_EMAIL) {
        console.log('🏪 Vendor email detected, forcing vendor role');
        setUserRole('vendor');
        toast.success('Welcome Vendor!', { duration: 3000 });
      }
      
      return result;
    } catch (error) {
      console.error('❌ AuthProvider: Login error:', error);
      setLoading(false);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    console.log('🔄 AuthProvider: Starting Google login');
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('✅ AuthProvider: Google login successful for:', result.user.email);
      
      // Force admin role for specific email
      if (result.user.email === ADMIN_EMAIL) {
        console.log('🔐 Admin email detected via Google, forcing admin role');
        setUserRole('admin');
        toast.success('Welcome Admin!', { duration: 3000 });
      }
      
      // Force vendor role for specific email
      if (result.user.email === VENDOR_EMAIL) {
        console.log('🏪 Vendor email detected via Google, forcing vendor role');
        setUserRole('vendor');
        toast.success('Welcome Vendor!', { duration: 3000 });
      }
      
      return result;
    } catch (error) {
      console.error('❌ AuthProvider: Google login error:', error);
      setLoading(false);
      toast.error(error.message || 'Google login failed');
      throw error;
    }
  };

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success('Password reset email sent!');
      })
      .catch((error) => {
        toast.error(error.message || 'Failed to send reset email');
        throw error;
      });
  };

  // Logout
  const logOut = () => {
    setLoading(true);
    setUserRole(null);
    localStorage.removeItem("userId");
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('🔄 AuthProvider: Auth state changed, user:', currentUser?.email);
      setUser(currentUser);
      
      if (currentUser) {
        // Create or update user in backend and get user data
        try {
          console.log('🔄 AuthProvider: Calling backend to create/update user');
          const response = await api.post("/users/create", {
            name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            firebaseUid: currentUser.uid,
          });
          
          console.log('✅ AuthProvider: Backend response:', response.data);
          
          if (response.data.success && response.data.user._id) {
            localStorage.setItem("userId", response.data.user._id);
            console.log('📊 Backend User Role:', response.data.user.role);
            
            // Force admin role for specific email - ALWAYS override backend
            if (currentUser.email === ADMIN_EMAIL) {
              console.log('🔐 Admin email detected, forcing admin role (overriding backend)');
              setUserRole('admin');
            }
            // Force vendor role for specific email - ALWAYS override backend
            else if (currentUser.email === VENDOR_EMAIL) {
              console.log('🏪 Vendor email detected, forcing vendor role (overriding backend)');
              setUserRole('vendor');
            }
            else {
              // Set role from backend for other users
              setUserRole(response.data.user.role);
              console.log('✅ Role set from backend:', response.data.user.role);
            }
          }
        } catch (error) {
          console.error("❌ AuthProvider: Error creating/updating user:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          
          // Even if backend fails, still set roles for specific emails
          if (currentUser.email === ADMIN_EMAIL) {
            console.log('🔐 Admin email detected (backend error), forcing admin role');
            setUserRole('admin');
          } else if (currentUser.email === VENDOR_EMAIL) {
            console.log('🏪 Vendor email detected (backend error), forcing vendor role');
            setUserRole('vendor');
          }
        }
      } else {
        console.log('👋 AuthProvider: User logged out');
        setUserRole(null);
        localStorage.removeItem("userId");
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const authInfo = {
    user,
    userRole,
    loading,
    setUser,
    setLoading,
    createUser,
    login,
    loginWithGoogle,
    googleSignIn,
    logOut,
    updateUserProfile,
    resetPassword,
  };
  
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProviders;
