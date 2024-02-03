import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Circle } from "react-preloaders";
import config from "../config";
import style from "../app.module.scss";
import showError from "../../utils/showError";

export const AuthClient = axios.create({
    baseURL:`${config.API_URL}/auth`
  })
  
  export const AuthContext = createContext({});
  
  const AuthProvider = ({ children }) => {
    const [data, setData] = useState();
  
    const handleFetchProtected = () => {};
  
    const handleLogOut = () => {};
  
    const handleSignUp = (data) => {
     AuthClient.post("/sign-up",data);
    };
    
  
    const handleSignIn = (data) => {};
  
    return (
      <AuthContext.Provider
        value={{
          data,
          handleFetchProtected,
          handleSignUp,
          handleSignIn,
          handleLogOut,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  export default AuthProvider;