import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Check for saved user data on app startup (instead of clearing it)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('👤 Restored user from localStorage:', userData);
          setUser(userData);
        }
      } catch (error) {
        console.error('❌ Error reading stored auth:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
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
      console.log('👤 AuthContext user set:', user);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);