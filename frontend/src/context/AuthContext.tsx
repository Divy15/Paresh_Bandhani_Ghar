import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  username: string;
  email?: string;
  photoUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Auto-run function when browser first loads or refreshes the website
  useEffect(() => {
    const verifyUserSession = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUsername = localStorage.getItem('auth_user');

      if (storedToken && storedUsername) {
        try {
          // OPTIONAL: Call your actual backend API here to check token validity
          // const res = await fetch('https://api.yourbrand.com/auth/verify', {
          //   headers: { 'Authorization': `Bearer ${storedToken}` }
          // });
          // if (!res.ok) throw new Error("Invalid token");

          // Simulation of a successful token validation delay
          setToken(storedToken);
          setUser({ username: storedUsername });
        } catch (error) {
          console.error("Token verification failed, clearing cache:", error);
          // Auto cleanup if token expired/corrupted
          localStorage.clear();
        }
      }
      setIsLoading(false); // Stop loading layout once check completes
    };

    verifyUserSession();
  }, []);

  const login = (username: string, jwtToken: string) => {
    localStorage.setItem('auth_token', jwtToken);
    localStorage.setItem('auth_user', username);
    setToken(jwtToken);
    setUser({ username });
  };

  const logout = () => {
    localStorage.clear(); // Clears all localstorage parameters
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
