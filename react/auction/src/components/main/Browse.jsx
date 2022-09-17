import React, { useEffect } from "react";
import "./Browse.css";
import { Header } from "./Header";
import { Footer } from "./Footer";
import axios from "axios";
import { useState } from "react";


export const Browse = (props) => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.mode === "item") {
      const itemid = window.location.pathname.split("/")[3];
      axios
        .get("/api/get/item/" + itemid)
        .then((response) => {
          console.log(response);
          setItem(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const search = window.location.search;
      const urlpar = new URLSearchParams(search);
      let page = urlpar.get("page");
      let name = urlpar.get("name");
      let cat = urlpar.get("cat");
      let lprice = urlpar.get("lprice");
      let rprice = urlpar.get("rprice");
      let location = urlpar.get("location");
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
            page
        )
        .then((response) => {
          console.log(response);
          setItems(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.mode]);

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
    tempItem.First_Bid = "$" + tempItem.First_Bid;
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
      <div>
        <div
          className="col-4 offset-4 mb-5 mt-3"
          style={{ fontWeight: "bold" }}
        >
          <a href={"/Browse/item/" + item.ItemID} style={{ color: "inherit" }}>
            {item.Name}
          </a>
        </div>
        {Object.keys(tempItem).map((key) => (
          <div className="row">
            <div className="col-4 col-sm-3 offset-2">{key}:</div>
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
          <div className="row">
            {loading ? null : (
              <div>
                {DisplayItem(item, true)}
                <div className="row mt-5">
                  <div className="col-3 offset-2">
                    <input
                      type="number"
                      step="0.01"
                      id="bidinp"
                      min={item.First_Bid}
                      className="form-control"
                      placeholder="$"
                    />
                  </div>
                  <div className="btn btn-primary col-2">Place Bid</div>
                </div>
              </div>
            )}
          </div>
          <div style={{ height: "20rem" }}></div>
        </div>
      ) : (
        <div className="container">
          <div className="row">
            {items.map((item) => (
              <div
                key={item.ItemID}
                className="col-12 col-md-5 border border-dark me-5 mb-5"
              >
                {DisplayItem(item, false)}
                <div style={{ height: "5rem" }}></div>
              </div>
            ))}
            <div style={{ height: "20rem" }}></div>
          </div>
        </div>
      )}
      {loading ? null : <Footer class="CustomFooter2" />}
    </div>
  );
};
