import React, { useEffect } from "react";
import "./Browse.css";
import { Header } from "./Header";
import { Footer } from "./Footer";
import axios from "axios";
import { useState, useContext } from "react";
import AuthContext from "../auth/Auth";

export const Browse = (props) => {
  const { AuthData } = useContext(AuthContext);
  const isGuest = sessionStorage.getItem("role");
  const [items, setItems] = useState([]);
  const [item, setItem] = useState([]);
  const [count, setCount] = useState();
  const [page, setPage] = useState();
  const [loading, setLoading] = useState(true);
  const [parameters, setParameters] = useState({
    name: "",
    cat: "",
    lprice: "",
    rprice: "",
    location: "",
    parpage: "",
  });

  useEffect(() => {
    if (props.mode === "item") {
      const itemid = window.location.pathname.split("/")[3];
      axios
        .get("/api/get/item/" + itemid)
        .then((response) => {
          setItem(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const search = window.location.search;
      const urlpar = new URLSearchParams(search);
      let parpage = urlpar.get("page");
      let name = urlpar.get("name");
      let cat = urlpar.get("cat");
      let lprice = urlpar.get("lprice");
      let rprice = urlpar.get("rprice");
      let location = urlpar.get("location");
      setParameters({
        name: name,
        cat: cat,
        lprice: lprice,
        rprice: rprice,
        location: location,
        parpage: parpage,
      });
      axios
        .get(
          "/api/list/items/all/" +
            "?name=" +
            name +
            "&cat=" +
            cat +
            "&lprice=" +
            lprice +
            "&rprice=" +
            rprice +
            "&location=" +
            location +
            "&page=" +
            parpage
        )
        .then((response) => {
          setItems(response.data[0].items);
          setCount(parseInt(response.data[1].count));
          setPage(parseInt(response.data[2].page));
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.mode]);

  const PlaceBid = (e) => {
    e.preventDefault();
    const confirm = window.confirm("Are you sure you want to place bid?");
    if (confirm) {
      axios
        .post(
          "/api/bids/",
          {
            ItemID: item.ItemID,
            Amount: e.target.amountinp.value,
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
        })
        .catch((error) => {
          console.log(error);
          alert("Failed to place bid");
        });
    }
  };

  const DisplayItem = (item, detail) => {
    let tempCategories = "";
    let tempItem = JSON.parse(JSON.stringify(item));
    delete tempItem["ItemID"];
    delete tempItem["Name"];
    if (!detail) {
      delete tempItem["Description"];
    }
    tempItem["Bids"] = tempItem["Number_Of_Bids"];
    delete tempItem["Number_Of_Bids"];
    tempItem.categories.map((cat, i) => {
      tempCategories += cat;
      if (tempItem.categories.length - 1 !== i) {
        tempCategories += ", ";
      }
      return null;
    });
    tempItem.categories = tempCategories;
    tempItem.Buy_Price = "$" + tempItem.Buy_Price;
    tempItem.Currently = "$" + tempItem.Currently;
    if (tempItem.Started == null) {
      delete tempItem["Started"];
      delete tempItem["Ends"];
    } else {
      let sdate = tempItem.Started.split("T")[0];
      let stime = tempItem.Started.split("T")[1].split(".")[0];
      tempItem.Started = sdate + ", " + stime;
      let edate = tempItem.Ends.split("T")[0];
      let etime = tempItem.Ends.split("T")[1].split("Z")[0];
      tempItem.Ends = edate + ", " + etime;
    }

    return (
      <div className="row">
        <div
          className={
            detail ? "col-4 mb-3 mt-5 offset-2" : "col-4 offset-1 mb-3 mt-5"
          }
          style={{ fontWeight: "bold" }}
        >
          <a href={"/Browse/item/" + item.ItemID + "/"} style={{ color: "inherit" }}>
            {item.Name}
          </a>
        </div>
        {Object.keys(tempItem).map((key) => (
          <div className="row d-flex justify-content-center">
            <div className={detail ? "col-4 col-sm-2" : "col-4 col-sm-4"}>
              {key}:
            </div>
            <div className="col-6 col-sm-6">{tempItem[key]}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="Browsepage">
      <Header page="Browse" />

      {props.mode === "item" ? (
        <div className="container">
          <div className="row d-flex justify-content-center">
            {loading ? null : (
              <div key={item.ItemID}>
                {DisplayItem(item, true)}
                {isGuest || item.Seller === AuthData.username ? null : (
                  <div className="row mt-5">
                    <form onSubmit={PlaceBid}>
                      <div className="row offset-2">
                        <div className="col-3">
                          <input
                            name="amountinp"
                            type="number"
                            step="0.01"
                            id="bidinp"
                            min={item.Currently + 0.01}
                            className="form-control"
                            placeholder={"$ " + item.Currently}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary col-2">
                          Place Bid
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{ height: "20rem" }}></div>
        </div>
      ) : (
        <div>
          <div className="container">
            <div className="row mb-5">
              <form>
                <div className="row d-flex justify-content-center">
                  <div className="col-6 form-floating">
                    <input
                      type="text"
                      id="searchform"
                      className="form-control"
                      name="name"
                      placeholder="Search By Name"
                    />
                    <label className="form-label ms-2" htmlFor="searchform">
                      Search By Name
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary col-1">
                    <span className="fa fa-search"></span>
                  </button>
                </div>
                <div className="row mt-4 col-2 m-auto">
                  <div
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Add filters
                  </div>
                </div>
                <div
                  className="modal fade"
                  id="exampleModal"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Filters
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="form-floating col-10">
                          <input
                            type="text"
                            id="categoriesinp"
                            className="form-control"
                            name="cat"
                            placeholder="categories"
                          />
                          <label
                            className="form-label ms-2"
                            htmlFor="categoriesinp"
                          >
                            categories
                          </label>
                          <div className="feedback ms-1">
                            (separate with commas)
                          </div>
                        </div>
                        <div className="row mt-2">
                          <div className="col-2" style={{ lineHeight: "70px" }}>
                            Price:
                          </div>
                          <div className="form-floating mt-2 col-4">
                            <input
                              type="number"
                              id="lpriceinp"
                              className="form-control"
                              name="lprice"
                              placeholder="from"
                            />
                            <label
                              className="form-label ms-2"
                              htmlFor="lpriceinp"
                            >
                              From
                            </label>
                          </div>
                          <div className="form-floating mt-2 col-4">
                            <input
                              type="number"
                              id="rpriceinp"
                              className="form-control"
                              name="rprice"
                              placeholder="to"
                            />
                            <label
                              className="form-label ms-2"
                              htmlFor="rpriceinp"
                            >
                              To
                            </label>
                          </div>
                        </div>

                        <div className="form-floating mt-4 col-10">
                          <input
                            type="text"
                            id="locationinp"
                            className="form-control"
                            name="location"
                            placeholder="location"
                          />
                          <label
                            className="form-label ms-2"
                            htmlFor="locationinp"
                          >
                            location
                          </label>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="container">
            <ul className="pagination mb-4 col-11">
              <div className="ms-auto"></div>
              {page - 1 >= 1 ? (
                <li className="page-item">
                  <a
                    className="page-link"
                    href={
                      "/Browse/?name=" +
                      parameters.name +
                      "&cat=" +
                      parameters.cat +
                      "&lprice=" +
                      parameters.lprice +
                      "&rprice=" +
                      parameters.rprice +
                      "&location=" +
                      parameters.location +
                      "&page=" +
                      parseInt(page - 1)
                    }
                  >
                    Previous
                  </a>
                </li>
              ) : null}
              {Array.from(Array(count), (c, i) => (
                <li className="page-item">
                  <a
                    className={
                      page === i + 1 ? "page-link active" : "page-link"
                    }
                    href={
                      "/Browse/?name=" +
                      parameters.name +
                      "&cat=" +
                      parameters.cat +
                      "&lprice=" +
                      parameters.lprice +
                      "&rprice=" +
                      parameters.rprice +
                      "&location=" +
                      parameters.location +
                      "&page=" +
                      parseInt(i + 1)
                    }
                  >
                    {i + 1}
                  </a>
                </li>
              ))}
              {page + 1 <= count ? (
                <li className="page-item">
                  <a
                    className="page-link"
                    href={
                      "/Browse/?name=" +
                      parameters.name +
                      "&cat=" +
                      parameters.cat +
                      "&lprice=" +
                      parameters.lprice +
                      "&rprice=" +
                      parameters.rprice +
                      "&location=" +
                      parameters.location +
                      "&page=" +
                      parseInt(page + 1)
                    }
                  >
                    Next
                  </a>
                </li>
              ) : null}
            </ul>
            <div className="row d-flex justify-content-center">
              {items.map((item) => (
                <div
                  key={item.ItemID}
                  className="col-12 col-md-5 border border-dark me-5 mb-5 tb-color"
                >
                  {DisplayItem(item, false)}
                  <div style={{ height: "5rem" }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {loading ? null : <Footer class="CustomFooter2" />}
    </div>
  );
};
