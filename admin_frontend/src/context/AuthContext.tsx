import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userPhone: string | null;
  login: (phoneNumber: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('pbg-auth') === 'true';
  });
  const [userPhone, setUserPhone] = useState<string | null>(() => {
    return localStorage.getItem('pbg-user-phone');
  });

  const login = (phoneNumber: string) => {
    setIsAuthenticated(true);
    setUserPhone(phoneNumber);
    localStorage.setItem('pbg-auth', 'true');
    localStorage.setItem('pbg-user-phone', phoneNumber);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserPhone(null);
    localStorage.removeItem('pbg-auth');
    localStorage.removeItem('pbg-user-phone');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userPhone, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};