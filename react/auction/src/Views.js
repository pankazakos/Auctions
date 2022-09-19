import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./components/auth/login";
import { SignUp } from "./components/register/SignUp";
import { Home } from "./components/main/home";
import { Pending } from "./components/register/Pending";
import { MyAdmin } from "./components/admin/MyAdmin";
import { ApproveUsers } from "./components/admin/ApproveUsers";
import { Browse } from "./components/main/Browse";
import { Manage } from "./components/main/Manage";
import AuthContext from "./components/auth/Auth";
import { ListUsers } from "./components/admin/ListUsers";


export const Views = () => {
  
  const {AuthData} = useContext(AuthContext);

  const isGuest = sessionStorage.getItem("role") ? true : false;

  return (
      <Routes>
        <Route path="/" element={AuthData.is_LoggedIn || isGuest ? <Home /> : <Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/MyAdmin" element={AuthData.role === "admin" ? <MyAdmin /> : <Navigate to={"/"} />} />
        <Route path="/MyAdmin/ApproveUsers" element={AuthData.role === "admin" ? <ApproveUsers /> : <Navigate to={"/"} />} />
        <Route path="/MyAdmin/ListUsers" element={AuthData.role === "admin" ? <ListUsers mode="default" /> : <Navigate to={"/"} />} />
        <Route path="/MyAdmin/ListUsers/:id" element={AuthData.role === "admin" ? <ListUsers mode="user" /> : <Navigate to={"/"} />} />
        <Route path="SignUp/Pending" element={<Pending />} />
        <Route path="/Browse" element={<Browse mode="default" />} /> 
        <Route path="/Browse/item/:id" element={<Browse mode="item" />} />
        <Route path="/Manage" element={AuthData.is_LoggedIn ? <Manage /> : <Navigate to={"/"} />} />
        <Route
          path="*"
          element={
            <div>
              <h3>Error 404 Not Found</h3>
            </div>
          }
        />
    </Routes>
  );
};
