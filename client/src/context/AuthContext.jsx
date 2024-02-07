import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Circle } from "react-preloaders";
import config from "../config";
import style from "../app.module.scss";
import showError from "../utils/showError";
import inMemoryJWT from "../memoryJWT/inMemoryJWT";

export const AuthClient = axios.create({
    baseURL:`${config.API_URL}/auth`,
    withCredentials:true
  });

 const AuthResourse = axios.create({
  baseURL:`${config}/resource`
 });

 AuthResourse.interceptors.request.use(
  (config) => {
   const accessToken = inMemoryJWT.getToken();
   
   if(accessToken){
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

   return config;
 },
 (error) => {
   Promise.reject(error);
 }
 );
  
  export const AuthContext = createContext({});
  
  const AuthProvider = ({ children }) => {
    const [isAppReady, setIsAppReady] = useState(false);
    const [isLogin , setIsLogin] = useState(false);
    const [data, setData] = useState();
  
    const handleFetchProtected = () => {
      AuthResourse.get("/protected")
       .then((res)=>{
        setData(res.data);
        console.log(res.data);
      }).catch(showError);     
    };
  
    const handleLogOut = () => {
      AuthClient.post("/logout")
      .then(()=>{
        setIsLogin(false);
        inMemoryJWT.deleteToken();
        setData();       
      }).catch(showError)
    };
  
    const handleSignUp = (data) => {
     AuthClient.post("/sign-up",data)
      .then((res)=>{
      const {accessToken ,accessTokenExpiration} = res.data;
      inMemoryJWT.setToken(accessToken,accessTokenExpiration);
      setIsLogin(true);
     })
     .catch(showError);
    };
    
    const handleSignIn = (data) => {
      AuthClient.post("/sign-in",data)
        .then((res)=>{
        const {accessToken ,accessTokenExpiration} = res.data;
        inMemoryJWT.setToken(accessToken,accessTokenExpiration);
        setIsLogin(true);
       })
       .catch(showError);
    };

    useEffect(()=>{
    AuthClient.post("/refresh")
    .then((res)=>{
      const { accessToken, accessTokenExpiration } = res.data;
      inMemoryJWT.setToken(accessToken, accessTokenExpiration);
      setIsAppReady(true);
      setIsLogin(true);
    })
    .catch(()=>{
      setIsAppReady(true);
      setIsLogin(false);
    })
    },[]);

    useEffect(()=>{
      const handlePersist =(event)=>{
        if(event.key === config.LOGOUT_STORAGE){
          inMemoryJWT.deleteToken();
          setIsLogin(false);
        }
      };
      window.addEventListener("storage",handlePersist);
   
      return ()=>{
        window.removeEventListener("storage", handlePersist);
      }
    },[]);

  
    return (
      <AuthContext.Provider
        value={{
          data,
          handleFetchProtected,
          handleSignUp,
          handleSignIn,
          handleLogOut,
          isLogin
        }}
      >
      {isAppReady ? (
        children
      ):(
        <div className={style.centered}>
        <Circle />
        </div>
      )}        
      </AuthContext.Provider>
    );
  };
  
  export default AuthProvider;