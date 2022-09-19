import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export const ListUsers = (props) => {
  const [usernames, setUsernames] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.mode === "user") {
      const username = window.location.pathname.split("/")[3];
      axios
        .get("/api/get/user/" + username, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
            accept: "application/json",
          },
        })
        .then((response) => {
          setUser(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          alert("Failed to fetch user");
        });
    } else {
      axios.get("/api/list/usernames/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }).then((response) => {
        setUsernames(response.data);
      }).catch((error) => {
        console.log(error);
        alert("Failed to fetch usernames from users");
      });
    }
  }, [props.mode]);

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
    <div style={{ backgroundColor: "rgb(243, 243, 243)", height: "100%" }}>
      {props.mode === "user" ? (
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/MyAdmin/">MyAdmin</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/MyAdmin/ListUsers">ListUsers</a>
            </li>
            <li className="breadcrumb-item" aria-current="page">
              {user.username}
            </li>
          </ol>
          {Object.keys(user).map((key) => (
            <div key={key} className="row">
              <div className="col-4">{key}:</div>
              <div className="col-4">{user[key]}</div>
            </div>
          ))}
          {user.is_approved === "False" && !loading ? (
            <div
              className="d-grid btn btn-success col-4 mt-5"
              onClick={() => approve(user.id)}
            >
              Approve
            </div>
          ) : null}
        </div>
      ) : (
        <div className="container">
          <div style={{ height: "2rem" }}></div>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/MyAdmin/">MyAdmin</a>
            </li>
            <li className="breadcrumb-item" aria-current="page">
              ListUsers
            </li>
          </ol>
          {usernames.map((username, i) => (
            <div key={i} className="row mt-3">
              <div className="col-4">
                <li>
                  <a
                    href={"/MyAdmin/ListUsers/" + username}
                    style={{ color: "inherit" }}
                  >
                    {username}
                  </a>
                </li>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
