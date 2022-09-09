import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";
import sha256 from "sha256";

export const SignUp = () => {
  // Store dynamically information of form
  const [formValue, setFormValue] = useState({
    password: "",
    username: "",
    fname: "",
    lname: "",
    email: "",
    phone_number: "",
    TIN: "",
    country: "",
    location: "",
    latitude: null,
    longitude: null,
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValue((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const {
    password,
    username,
    fname,
    lname,
    email,
    phone_number,
    TIN,
    country,
    location,
    latitude,
    longitude,
  } = formValue;

  //hash password
  let hashedPassword = sha256(password);

  // Check dynamically if confirm password matches the original password

  const [showError, setShowError] = useState(false);
  const [isRpassEmpty, setIsRpassEmpty] = useState(true);
  const [RpassClass, setRpassClass] = useState("form-control");

  const [Rpass, setRpass] = useState("");

  const handleRpassChange = (event) => {
    setRpass(event.target.value);
    setIsRpassEmpty(false);
    if (event.target.value === "") {
      setIsRpassEmpty(true);
    }
  };

  useEffect(() => {
    if (!isRpassEmpty) {
      if (password === Rpass) {
        setShowError(false);
        setRpassClass("form-control is-valid");
      } else {
        setShowError(true);
        setRpassClass("form-control is-invalid");
      }
    } else {
      setRpassClass("form-control");
    }
  }, [Rpass, isRpassEmpty, password]);

  // Check form for mistakes at frontend and send it to backend if there are no errors occured

  const nav = useNavigate();

  const [err, setErr] = useState({
    err_username: "",
    err_email: "",
    err_phone_number: "",
    err_TIN: "",
  });

  function ValidateForm() {
    let empty = {
      username: username.length === 0,
      password: password.length === 0,
      first_name: fname.length === 0,
      last_name: lname.length === 0,
      email: email.length === 0,
      phone_number: phone_number.length === 0,
      TIN: TIN.length === 0,
      country: country.length === 0,
      location: location.length === 0,
    };
    if (
      empty.username ||
      empty.password ||
      empty.first_name ||
      empty.last_name ||
      empty.email ||
      empty.phone_number ||
      empty.TIN ||
      empty.country ||
      empty.location
    ) {
      alert("Some of the fields required are empty");
      return false;
    } else if (Rpass !== password) {
      alert("Passwords did not match");
      return false;
    } else {
      return true;
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (ValidateForm()) {
      axios
        .post("/api/create/user", {
          password: hashedPassword,
          username: username,
          first_name: fname,
          last_name: lname,
          email: email,
          Phone_Number: phone_number,
          TIN: TIN,
          Country: country,
          Location: location,
          Latitude: latitude,
          Longitude: longitude,
        })
        .then((response) => {
          //go to home page
          nav("/SignUp/Pending");
        })
        .catch((error) => {
          alert("Please check the errors and try again");
          setErr({
            err_username:
              typeof error.response.data.username === "undefined"
                ? null
                : error.response.data.username[0],
            err_email:
              typeof error.response.data.email === "undefined"
                ? null
                : error.response.data.email[0],
            err_phone_number:
              typeof error.response.data.Phone_Number === "undefined"
                ? null
                : error.response.data.Phone_Number[0],
            err_TIN:
              typeof error.response.data.TIN === "undefined"
                ? null
                : error.response.data.TIN[0],
          });
        });
    }
  };
  // Show errors from backend
  const { err_username, err_email, err_phone_number, err_TIN } = err;

  return (
    <div className="SignUpPage">
      <div className="container">
        <div className="MyRow"></div>
        <div className="row">
          <div className="card-body border border-3 border-dark" id="SignUpCard">
            <div className="row text-center text-white pt-sm-5 pb-sm-4 pt-3">
              <h2>Registration Form</h2>
            </div>
            <form>
              <div className="row">
                <div className="col-12 col-sm-5 offset-sm-1">
                  <div className="row text-white offset-2 pt-4">
                    <h2>General Info</h2>
                  </div>
                  <div className="row">
                    <div className="row">
                      <div className="col-8 offset-2 offset-sm-1">
                        <div className="form-floating mt-3">
                          <input
                            type="text"
                            name="fname"
                            className="form-control"
                            id="firstnameInp"
                            placeholder="First Name"
                            onChange={handleFormChange}
                            value={fname}
                          />
                          <label htmlFor="firstnameInp" className="form-label">
                            First Name
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-8 offset-2 offset-sm-1">
                        <div className="form-floating mt-3">
                          <input
                            type="text"
                            name="lname"
                            className="form-control"
                            id="lastnameInp"
                            placeholder="Last Name"
                            onChange={handleFormChange}
                            value={lname}
                          />
                          <label htmlFor="lastnameInp" className="form-label">
                            Last Name
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-8 offset-2 offset-sm-1">
                        <div className="form-floating mt-3">
                          <input
                            type="tel"
                            name="phone_number"
                            className="form-control"
                            id="phonenumberInp"
                            placeholder="Phone Number"
                            onChange={handleFormChange}
                            value={phone_number}
                          />
                          <label
                            htmlFor="phonenumberInp"
                            className="form-label"
                          >
                            Phone Number
                          </label>
                        </div>
                        {err_phone_number ? (
                          <div className="text-white mt-1">
                            *phone number already exists
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-8 offset-2 offset-sm-1">
                        <div className="form-floating mt-3">
                          <input
                            type="text"
                            name="TIN"
                            className="form-control"
                            id="TINInp"
                            placeholder="TIN"
                            onChange={handleFormChange}
                            value={TIN}
                          />
                          <label htmlFor="TINInp" className="form-label">
                            TIN
                          </label>
                        </div>
                        {err_TIN ? (
                          <div className="text-white mt-1">
                            *Tax Identification Number already exists
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-8 offset-2 offset-sm-1">
                        <div className="form-floating mt-3">
                          <input
                            type="text"
                            name="country"
                            className="form-control"
                            id="CountryInp"
                            placeholder="Country"
                            onChange={handleFormChange}
                            value={country}
                          />
                          <label htmlFor="CountryInp" className="form-label">
                            Country
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-8 offset-2 offset-sm-1">
                        <div className="form-floating mt-3">
                          <input
                            type="text"
                            name="location"
                            className="form-control"
                            id="LocationInp"
                            placeholder="Location"
                            onChange={handleFormChange}
                            value={location}
                          />
                          <label htmlFor="LocationInp" className="form-label">
                            Location
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-8 col-sm-4 offset-2 offset-sm-1">
                        <div className="form-floating mt-3">
                          <input
                            type="number"
                            name="latitude"
                            step="0.01"
                            className="form-control"
                            id="LatitudeInp"
                            placeholder="Latitude"
                            onChange={handleFormChange}
                            value={latitude}
                          />
                          <label htmlFor="LatitudeInp" className="form-label">
                            Latitude
                          </label>
                          <div className="feedback text-white pt-1">
                            optional
                          </div>
                        </div>
                      </div>
                      <div className="col-8 col-sm-4 offset-2 offset-sm-0">
                        <div className="form-floating mt-3">
                          <input
                            type="number"
                            name="longitude"
                            step="0.01"
                            className="form-control"
                            id="LongitudeInp"
                            placeholder="Longitude"
                            onChange={handleFormChange}
                            value={longitude}
                          />
                          <label htmlFor="LongitudeInp" className="form-label">
                            Longitude
                          </label>
                          <div className="feedback text-white pt-1">
                            optional
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-5">
                  <div className="row text-white offset-2 pt-4">
                    <h2>Acount info</h2>
                  </div>
                  <div className="row">
                    <div className="col-8 offset-2 offset-sm-1">
                      <div className="form-floating mt-3">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          id="emailInp"
                          placeholder="Email"
                          onChange={handleFormChange}
                          value={email}
                        />
                        <label htmlFor="emailInp" className="form-label">
                          Email
                        </label>
                      </div>
                      {err_email ? (
                        <div className="text-white mt-1">
                          *email already exists
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-8 offset-2 offset-sm-1">
                      <div className="form-floating mt-3">
                        <input
                          type="username"
                          name="username"
                          className="form-control"
                          id="usernameInp"
                          placeholder="Username"
                          onChange={handleFormChange}
                          value={username}
                        />
                        <label htmlFor="usernameInp" className="form-label">
                          Username
                        </label>
                      </div>
                      {err_username ? (
                        <div className="text-white mt-1">
                          *username already exists
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-8 offset-2 offset-sm-1">
                      <div className="form-floating mt-3">
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          id="floatingPassword"
                          placeholder="Password"
                          onChange={handleFormChange}
                          value={password}
                        />
                        <label htmlFor="floatingPassword">Password</label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-8 offset-2 offset-sm-1">
                      <div className="form-floating mt-3">
                        <input
                          type="password"
                          name="repeatpassword"
                          className={RpassClass}
                          id="RepeatPassword"
                          placeholder="Password"
                          onChange={handleRpassChange}
                          value={Rpass}
                        />
                        <label htmlFor="RepeatPassword">
                          Repeat your password
                        </label>
                      </div>
                      {showError && !isRpassEmpty ? (
                        <div className="text-white mt-1">
                          Passwords don't match
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-8 offset-2 offset-sm-1 pt-4">
                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-lg shadow-button "
                          id="RegisterButton"
                          onClick={handleSubmit}
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="MyRow"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
