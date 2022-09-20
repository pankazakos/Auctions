import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const DisplayUser = (user) => {
  let tempUser = JSON.parse(JSON.stringify(user));
  if (tempUser.Latitude == null || tempUser.Longitude == null) {
    tempUser.Latitude = "Null";
    tempUser.Longitude = "Null";
  }
  tempUser.Phone_Number =
    "+" +
    tempUser.Phone_Number.slice(0, 2) +
    " " +
    tempUser.Phone_Number.slice(2, 12);
  tempUser.is_approved = String(tempUser.is_approved);
  tempUser.is_staff = String(tempUser.is_staff);
  tempUser.is_superuser = String(tempUser.is_superuser);
  console.log(tempUser);

  return (
    <div className="row mt-3">
      {Object.keys(tempUser).map((key, i) => (
        <div key={i} className="row">
          <div className="col-6 col-sm-4">{key}:</div>
          <div className="col-6 col-sm-4">{tempUser[key]}</div>
        </div>
      ))}
    </div>
  );
};

export const ApproveUsers = () => {
  const [users, SetUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/api/list/users/", {
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
        "/api/users/approve/" + id,
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
    <div style={{ height: "100%", backgroundColor: "rgb(243, 243, 243)" }}>
      <div className="container">
        <div className="row">
          {users.map((user) => (
            <div key={user.id}>
              {DisplayUser(user)}
              <div
                className="d-grid btn btn-success col-4 mt-3"
                onClick={() => {
                  approve(user.id);
                }}
              >
                Approve
              </div>
              <hr></hr>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
