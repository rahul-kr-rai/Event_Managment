import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Initialize from SESSION Storage (Deleted when browser closes)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem('user'); // <--- CHANGED to sessionStorage
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from storage", error);
      return null;
    }
  });

  // 2. Sync state to SESSION Storage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user)); // <--- CHANGED
    } else {
      sessionStorage.removeItem('user'); // <--- CHANGED
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear(); // Ensure clear on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);