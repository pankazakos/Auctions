import React from "react";
import { createContext, useState } from "react";
import jwt_decode from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import sha256 from "sha256";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  const [err, setErr] = useState({
    empty_username: "",
    err_credentials: "",
  });

  const LoginUser = (event) => {
    event.preventDefault();
    axios
      .post("/api/token/", {
        username: event.target.usernameInp.value,
        password: sha256(event.target.passwordInp.value),
      })
      .then((response) => {
        setSubmitted(true);
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        nav("/");
      })
      .catch((error) => {
        console.log(error);
        setErr({
          empty_username:
            typeof error.response.data.username === "undefined"
              ? null
              : error.response.data.username[0],
          err_credentials:
            typeof error.response.data.detail === "undefined"
              ? null
              : error.response.data.detail[0],
        });
      });
  };

  const { empty_username, err_credentials } = err;

  const [AuthData, setAuthData] = useState({
    jwt: "",
    user_id: "",
    username: "",
    role: "guest",
    is_LoggedIn: localStorage.getItem("access_token") ? true : false,
  });

  // Triggered at initial render and at form submission
  useEffect(() => {
    if (submitted) {
      setLoading(true);
    }
    //Decode jwt if exists
    const decoded = localStorage.getItem("access_token")
      ? jwt_decode(localStorage.getItem("access_token"))
      : null;
    if (decoded) {
      axios
        .get("/api/get/user/" + decoded["user_id"], {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
            accept: "application/json",
          },
        })
        .then((response) => {
          setLoading(false);
          setAuthData({
            jwt: localStorage.getItem("access_token"),
            user_id: decoded["user_id"],
            username: response.data.username,
            role: response.data.is_superuser ? "admin" : "user",
            is_LoggedIn: true,
          });
        })
        .catch((error) => {
          console.log(error);
          alert("Something went wrong. Please Login again");
        });
    } else {
      setLoading(false);
    }
  }, [submitted]);

  const LogoutUser = () => {
    setAuthData({
      jwt: "",
      user_id: "",
      username: "",
      role: "guest",
      is_LoggedIn: false,
    });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    nav("/");
  };

  return (
    <AuthContext.Provider
      value={{
        AuthData,
        LoginUser: LoginUser,
        LogoutUser: LogoutUser,
        empty_username: empty_username,
        err_credentials: err_credentials,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
