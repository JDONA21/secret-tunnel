import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  const signup = async (username) => {
    try {
      const response = await fetch(API + "/signup", {
        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const result = await response.json();
      setToken(result.token);
      setLocation("TABLET");
    } catch (e) {
      console.error(e);
    }
  };
  // TODO: authenticate
  const authenicate = async () => {
    if (!token) throw Error("You must be logged in");
    try {
      const response = await fetch(API + "/authenticate", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!response.ok) throw Error("Invalid token.");
    } catch (e) {
      console.error(e);
    }
  };
  const value = { location, signup, authenicate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
