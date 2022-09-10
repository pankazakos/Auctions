import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth/Auth";
import "./Header.css";

export const Header = (props) => {
  const { AuthData, LogoutUser } = useContext(AuthContext);

  const [activeClass, setActiveClass] = useState({
    home: "nav-link text-white",
    browse: "nav-link text-white",
    manage: "nav-link text-white",
  });

  const active = props.page;
  console.log(active);

  useEffect(() => {
    if (active === "Home") {
      setActiveClass((prevState) => {
        return {
          ...prevState,
          home: "nav-link text-white active",
        };
      });
    } else if (active === "Browse") {
      setActiveClass((prevState) => {
        return {
          ...prevState,
          browse: "nav-link text-white active",
        };
      });
    } else if (active === "Manage") {
      setActiveClass((prevState) => {
        return {
          ...prevState,
          manage: "nav-link text-white active",
        };
      });
    }
  }, [active]);

  const removeGuest = () =>{
    sessionStorage.removeItem("role");
  };

  return (
    <div className="CustomHeader">
      <div className="container">
        <div className="navbar navbar-expand-lg CustomNavbar fixed-top shadow-lg border-bottom border-dark border-2">
          <a className="navbar-brand me-5" href="/">
            <img
              src={require("../../logo.png")}
              className="ms-2 border border-1 border-dark shadow"
              alt="Logo"
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              {/* ms-3 ms-lg-0 me-sm-5 */}
              <li className="nav-item col-4 ms-3 ms-lg-0 me-sm-5">
                <Link to={"/"} className={activeClass.home}>
                  <h4>Home</h4>
                </Link>
              </li>
              <li className="nav-item col-4 ms-3 ms-lg-0 me-sm-5">
                <Link to={"/Browse"} className={activeClass.browse}>
                  <h4>Browse</h4>
                </Link>
              </li>
              {/* Display Manage only to logged in users and not guests */}
              {AuthData.is_LoggedIn ? (
                <li className="nav-iteem col-4 ms-3 ms-lg-0 me-sm-5">
                  <Link to={"/Manage"} className={activeClass.manage}>
                    <h4>Manage</h4>
                  </Link>
                </li>
              ) : null}
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown ms-3 ms-lg-0 me-sm-5">
                {AuthData.is_LoggedIn ? (
                  <div>
                    <a
                      className="nav-link dropdown-toggle text-white"
                      href="/"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ fontSize: "1.5rem" }}
                    >
                      {AuthData.username}
                    </a>
                    <ul className="dropdown-menu" style={{ margin: 0 }}>
                      <li>
                        <a
                          className="dropdown-item text-white"
                          href="/"
                          onClick={LogoutUser}
                        >
                          Logout
                        </a>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <Link to={"/"} onClick={removeGuest} className="btn btn-primary me-3 Header-btn">
                      Sign In
                    </Link>
                    <Link to={"/SignUp"} onClick={removeGuest} className="btn btn-primary Header-btn">
                      Sign Up
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
