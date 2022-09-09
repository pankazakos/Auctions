import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "./ApproveUsers.css";

export const ApproveUsers = () => {
  const [users, SetUsers] = useState([]);

  useEffect(() => {
    axios
      .get("../api/list/users", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json",
          accept: "application/json",
        },
      })
      .then((response) => {
        SetUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [SetUsers]);

  const approve = (id) => {
    axios
      .put(
        "../api/users/approve/" + id,
        {
          is_approved: true,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      )
      .then((response) => {
        window.location.reload(false);
      });
  };

  return (
    <div className="ApproveUserspage">
      <div className="container">
        <hr className="mt-auto col-8"></hr>
        {users.map((user) => (
          <div key={user.id}>
            <div className="row">
              <div className="col-2">
                {Object.keys(user).map((key, i) => (
                  <div key={i}>{key}:</div>
                ))}
              </div>
              <div className="col-4">
                {Object.values(user).map((field, i) => (
                  <div key={i}>{field}</div>
                ))}
              </div>
            </div>
            <div
              className="d-grid btn btn-success col-4 mt-3"
              onClick={() => {
                approve(user.id);
              }}
            >
              Approve
            </div>
            <hr className="col-8"></hr>
          </div>
        ))}
      </div>
      <hr className="m-auto col-8"></hr>
    </div>
  );
};
