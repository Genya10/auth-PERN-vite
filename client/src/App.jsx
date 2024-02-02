import style from "./app.module.scss";
import { Link, Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Demo from "./pages/Demo";
import { SnackbarProvider } from "notistack";
import { AuthContext } from "./context/AuthContext";

const App =()=>{
  return(
    <div className={style.wrapper}>
      <SnackbarProvider/>
      <BrowserRouter>
        <nav className={style.nav}>
          <Link to="sign-in">Enter</Link>
          <Link to="sign-up">Registration</Link>
          <Link to="demo">Demo</Link>
        </nav>
        <Routes>
          <Route path="demo" element={<Demo />} />
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="*" element={<Navigate to={"sign-in"} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
