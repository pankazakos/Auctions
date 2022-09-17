import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export const Footer = (props) => {

  return (
    <div className={props.class}>
      <div className="container">
        <div className="row mt-2">
          <div className="col-10 m-auto">
            <div className="row">
              <div className="col-6 col-sm-3 offset-1">
                <h4 className="mt-2">Links</h4>
                <div className="me-auto">
                  <div>
                    <Link
                      to={"/"}
                      className="text-decoration-none color"
                      style={{ color: "inherit" }}
                    >
                      Home
                    </Link>
                  </div>
                  <div>
                    <Link
                      to={"/Browse"}
                      className="text-decoration-none"
                      style={{ color: "inherit" }}
                    >
                      Browse
                    </Link>
                  </div>
                  <div>
                    <Link
                      to={"/Manage"}
                      className="text-decoration-none"
                      style={{ color: "inherit" }}
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-6 col-sm-3 offset-1">
                <h4 className="mt-2">Company</h4>
                <div className="me-auto">
                  <div>About Us</div>
                  <div>Privacy Policy</div>
                  <div>Contact Us</div>
                </div>
              </div>
              <div className="col-6 col-sm-3 offset-1">
                <h4 className="mt-4 mt-sm-2 mb-4">Social Media</h4>
                <span
                  className="fa fa-brands fa-xl fa-square-facebook col-2 col-lg-1 ms-lg-3 me-sm-1"
                  style={{ color: "#395693" }}
                ></span>
                <span
                  className="fa fa-brands fa-xl fa-square-twitter col-2 col-lg-1 me-sm-1"
                  style={{ color: "#395693" }}
                ></span>
                <span
                  className="fa fa-brands fa-xl fa-square-instagram col-2 col-lg-1 me-sm-1"
                  style={{ color: "#395693" }}
                ></span>
                <span
                  className="fa fa-brands fa-xl fa-linkedin col-2 col-lg-1 me-sm-1"
                  style={{ color: "#395693" }}
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
