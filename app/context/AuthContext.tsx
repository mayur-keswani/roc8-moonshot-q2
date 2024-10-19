"use client";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { AuthType } from "../types/custTypes";
import { getCookie, setCookie } from "../helper";
import { useRouter } from "next/navigation";

type AuthContextType = {
  auth: AuthType;
  onLogin: (username: string) => void;
  onLogout: () => void;
};
let defaultValue: AuthContextType = {
  auth: {
    isLoggedIn: false,
    username: "",
  },
  onLogin: (username: string) => {},
  onLogout: () => {},
};
export var AuthContext = createContext<AuthContextType>(defaultValue);

const AuthContextProvider: React.FC<PropsWithChildren> = (props) => {
  const router = useRouter();
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    username: "",
  });

  function onLogin(username: string) {
    if (typeof window !== "undefined") {
      setAuth({
        isLoggedIn: true,
        username,
      });

      setCookie(
        "auth",
        JSON.stringify({
          isLoggedIn: true,
          username,
        })
      );
    }
  }
  function onLogout() {
    setAuth({ isLoggedIn: false, username: "" });
    router.push("/login");
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authDetail = getCookie("auth");
      if (authDetail) setAuth(authDetail);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, onLogin, onLogout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
