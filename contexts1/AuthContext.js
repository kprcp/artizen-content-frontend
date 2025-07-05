import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  // ✅ Always clear user from localStorage and start from SignUp
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false); // ✅ Done loading
    }
  }, []);

  // ✅ Save or remove user in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [user]);

  // ✅ Optional: log user when updated (for debug)
  useEffect(() => {
    if (user) {
      console.log('👤 AuthContext user set:', user); // Check if profileImage is present
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}> {/* ✅ Added loading to context */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
