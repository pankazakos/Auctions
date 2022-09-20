import React from "react";
import { Link } from "react-router-dom";


export const MyAdmin = () => {
  return (
    <div style={{ height: "100%", backgroundColor: "rgb(243, 243, 243)"}}>
      <div className="container">
        <div className="row text-center pt-5">
          <h1>Admin page</h1>
        </div>
        <div className="row mt-5">
          <div className="col-4 offset-2">
            <h2>Available actions:</h2>
          </div>
        </div>
        <hr className="row col-8 offset-2"></hr>
        <div className="row mt-5">
          <div className="col-4 offset-3">
            <h3>1. List All users</h3>
          </div>
          <div className="col-5">
            <Link to="/MyAdmin/ListUsers" className="btn btn-secondary">
              Go to page
            </Link>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-4 offset-3">
            <h3>2. Unnaproved users</h3>
          </div>
          <div className="col-5">
            <Link to="/MyAdmin/ApproveUsers" className="btn btn-secondary">
              Go to page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
