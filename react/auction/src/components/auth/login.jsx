import React from "react";
import "./login.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./Auth";

export const Login = () => {

  const { LoginUser, empty_username, err_credentials } =
    useContext(AuthContext);

  const setGuest = () => {
    sessionStorage.setItem("role", "guest");
  };

  return (
    <div className="welcomepage">
      <div className="container">
        <div className="MyRow"></div>
        <div className="row">
          <div className="col-8 offset-2">
            <div
              className="card-body border border-3 border-dark"
              id="WelcomeCard"
            >
              <div className="row text-center pt-2 pt-sm-5 text-white">
                <h2>Welcome to Auctions</h2>
              </div>

              <div className="row pt-5">
                <form onSubmit={LoginUser}>
                  <div className="offset-1 offset-sm-4">
                    <div className="form-floating col-10 col-sm-6 mt-3">
                      <input
                        type="username"
                        name="username"
                        className="form-control"
                        id="usernameInp"
                        placeholder="Username"
                      />
                      <label htmlFor="usernameInp" className="form-label">
                        Username
                      </label>
                    </div>
                    {empty_username ? (
                      <div className="text-white">
                        *credentials not valid
                      </div>
                    ) : null}
                    {err_credentials ? (
                      <div className="text-white col-10 col-sm-6 mt-1">
                        *credentials not valid
                      </div>
                    ) : null}
                    <div className="form-floating col-10 col-sm-6 mt-3">
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        id="passwordInp"
                        placeholder="Password"
                      />
                      <label htmlFor="passwordInp" className="form-label">
                        Password
                      </label>
                    </div>
                    {err_credentials ? (
                      <div className="text-white col-10 col-sm-6 mt-1">
                        *username and password do not belong to any account
                      </div>
                    ) : null}
                    <div className="col mt-3 mb-3">
                      <button
                        type="submit"
                        className="btn btn-primary shadow-button"
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="row pt-1 pt-sm-3 text-white">
                <div className="col-10 col-sm-4 mx-auto text-center">
                  <p>Don't have an acount? Sign up now for free!</p>
                </div>
              </div>
              <div className="d-grid gap-2 col-8 col-sm-4 mx-auto pb-3">
                <Link
                  to="/SignUp"
                  className="btn btn-success shadow-button"
                  type="button"
                >
                  Sign Up
                </Link>
              </div>
              <p className="row text-white justify-content-center">
                ------------ OR ------------
              </p>
              <Link
                to="/"
                className="d-grid col-4 offset-4 btn btn-secondary shadow-button"
                onClick={setGuest}
              >
                Continue As Guest
              </Link>
              <div className="MyRow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
