import React from "react";
import "./Manage.css";
import { Header } from "./Header";
import { Footer } from "./Footer";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const SubmitModal = (event) => {
  event.preventDefault();
  let categories = event.target.InpCategories.value.split(",");
  Object.keys(categories).forEach((key) => {
    categories[key] = categories[key].trim();
  });
  axios
    .post(
      "api/create/item/",
      {
        Name: event.target.InpName.value,
        Buy_Price: parseFloat(event.target.InpBuyPrice.value),
        First_Bid: parseFloat(event.target.InpFirstBid.value),
        Currently: parseFloat(event.target.InpFirstBid.value),
        Number_Of_Bids: "0",
        categories: categories,
        Description: event.target.InpDescription.value,
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
      console.log(response);
      alert("Item succesfully created");
    })
    .catch((error) => {
      console.log(error);
      alert("Failed to create new item");
    });
};

export const Manage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("api/list/items/inactive", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json",
          accept: "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setItems]);

  const DisplayItem = (item) => {
    let tempCategories = "";
    let tempItem = JSON.parse(JSON.stringify(item));
    tempItem.categories.map((cat, i) => {
      tempCategories += cat;
      if (tempItem.categories.length - 1 != i) {
        tempCategories += ", ";
      }
    });
    tempItem.categories = tempCategories;
    tempItem.Buy_Price = "$" + tempItem.Buy_Price;
    tempItem.First_Bid = "$" + tempItem.First_Bid;
    tempItem.Currently = "$" + tempItem.Currently;
    let date = tempItem.Started.split("T")[0];
    let time = tempItem.Started.split("T")[1].split(".")[0];
    tempItem.Started = date + ", " + time;
    if (tempItem.Ends == null) {
      tempItem.Ends = "Null";
    }

    return (
      <div>
        {Object.keys(tempItem).map((key, i) => (
          <div className="row">
            <div className="col-4">{key}:</div>
            <div className="col-4">{tempItem[key]}</div>
          </div>
        ))}
        <hr className="mt-3"></hr>
      </div>
    );
  };

  return (
    <div className="Managepage">
      <Header page="Manage" />
      <div
        className="row d-grid btn btn-success col-md-2 col-4 m-auto"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Add new Item
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add new item for auction
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={SubmitModal} id="ManageForm">
                <div className="row">
                  <div className="col-md-10 col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        id="InpName"
                        className="form-control"
                        placeholder="Name"
                      />
                      <label htmlFor="InpName" className="form-label ms-1">
                        Name
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-5 col-12">
                    <div className="form-floating">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        id="InpBuyPrice"
                        className="form-control"
                        placeholder="Buy Price"
                      />
                      <label htmlFor="InpBuyPrice" className="form-label ms-1">
                        Buy Price
                      </label>
                    </div>
                  </div>
                  <div className="col-md-5 col-12 mt-md-0 mt-3">
                    <div className="form-floating">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        id="InpFirstBid"
                        className="form-control"
                        placeholder="First Bid"
                      />
                      <label htmlFor="InpFirstBid" className="form-label ms-1">
                        First Bid
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-10 col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        id="InpCategories"
                        className="form-control"
                        placeholder="Categories"
                      />
                      <label
                        htmlFor="InpCategories"
                        className="form-label ms-1"
                      >
                        Categories
                      </label>
                    </div>
                  </div>
                  <div className="col-12 mt-1">(Separate with commas)</div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-10 col-12">
                    <div className="form-floating">
                      <textarea
                        type="textarea"
                        id="InpDescription"
                        className="form-control"
                        placeholder="Description"
                        style={{ height: "12rem" }}
                      ></textarea>
                      <label
                        htmlFor="InpDescription"
                        className="form-label ms-1"
                      >
                        Description
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                form="ManageForm"
                className="btn btn-success"
                data-bs-dismiss="modal"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row mt-5">
          {items.map((item) => (
            <div key={item.id}>{DisplayItem(item)}</div>
          ))}
        </div>
      </div>
      <div style={{ height: "10rem" }}></div>
      <Footer />
    </div>
  );
};
