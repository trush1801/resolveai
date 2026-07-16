import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Checks for structural fallback cache on initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('resolveai_user');
    const savedToken = localStorage.getItem('resolveai_token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('resolveai_user', JSON.stringify(userData));
    localStorage.setItem('resolveai_token', userToken); // Set session bridge token
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('resolveai_user');
    localStorage.removeItem('resolveai_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);