import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";

interface User {
  id: string;
  role: string;
}

interface AuthData {
  token: string;
  user: User;
}

interface AuthContextProps {
  authData: AuthData | null;
  setAuthData: (data: AuthData | null) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps>({
  authData: null,
  setAuthData: () => {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData | null>(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        return { token, user: parsedUser };
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (authData) {
      
      localStorage.setItem("token", authData.token);
      localStorage.setItem("user", JSON.stringify(authData.user));
    } else {
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [authData]);

  
  const contextValue = useMemo(() => ({ authData, setAuthData }), [authData]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
