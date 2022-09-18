import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Modal } from "./Modal";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const CreateItem = (event) => {
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
      alert("Item succesfully created");
      window.location.reload(false);
    })
    .catch((error) => {
      alert("Failed to create new item");
    });
};

const EditItem = (event, id) => {
  event.preventDefault();
  let categories = event.target.InpCategories.value.split(",");
  Object.keys(categories).forEach((key) => {
    categories[key] = categories[key].trim();
  });
  axios
    .put(
      "api/edit/item/" + id,
      {
        Name: event.target.InpName.value,
        Buy_Price: parseFloat(event.target.InpBuyPrice.value),
        First_Bid: parseFloat(event.target.InpFirstBid.value),
        Currently: parseFloat(event.target.InpFirstBid.value),
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
      alert("Item succesfully edited");
      window.location.reload(false);
    })
    .catch((error) => {
      console.log(error);
      alert("Failed to edit item");
    });
};

const DeleteItem = (id) => {
  let confirm = window.confirm(
    "Are you sure you want to delete selected item?"
  );
  if (confirm) {
    axios
      .delete("api/delete/item/" + id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json",
          accept: "application/json",
        },
      })
      .then((response) => {
        alert("Successfully deleted item");
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to delete item");
      });
  }
};

export const Manage = () => {
  const [InactiveItems, setInactiveItems] = useState([]);
  const [ActiveItems, setActiveItems] = useState([]);
  const [biddeditems, setBiddedItems] = useState([]);
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("api/list/items/inactive/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json",
          accept: "application/json",
        },
      })
      .then((response) => {
        setInactiveItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("api/list/items/active/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json",
          accept: "application/json",
        },
      })
      .then((response) => {
        setActiveItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });

      axios.get("/api/list/items/bidded/", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }).then((response) => {
        setBiddedItems(response.data);
      }).catch((error) => {
        console.log(error);
      });
  }, []);

  const ActivateItem = (id) => {
    let confirm = window.confirm("Are you sure you want to start the auction?");
    if (confirm) {
      axios
        .put(
          "api/item/activate/" + id,
          {
            Ends: time + "+00:00",
            Active: true,
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
          alert("Item auction has started");
          window.location.reload(false);
        })
        .catch((error) => {
          console.log(error);
          alert("Failed to start auction");
        });
    }
  };

  const DisplayItem = (item) => {
    let tempCategories = "";
    let tempItem = JSON.parse(JSON.stringify(item));
    delete tempItem["ItemID"];
    delete tempItem["Name"];
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
      tempItem["Bids"] = tempItem["Number_Of_Bids"];
      delete tempItem["Number_Of_Bids"];
      let sdate = tempItem.Started.split("T")[0];
      let stime = tempItem.Started.split("T")[1].split(".")[0];
      tempItem.Started = sdate + ", " + stime;
      let edate = tempItem.Ends.split("T")[0];
      let etime = tempItem.Ends.split("T")[1].split("Z")[0];
      tempItem.Ends = edate + ", " + etime;
    }

    return (
      <div>
        <hr className="mt-3"></hr>
        <div className="col-5 offset-1 mb-4" style={{ fontWeight: "bold" }}>
          {item.Name}
        </div>
        {Object.keys(tempItem).map((key, i) => (
          <div className="row">
            <div className="col-6 col-sm-2">{key}:</div>
            <div className="col-6 col-sm-8">{tempItem[key]}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="Managepage">
      <Header page="Manage" />
      <div
        className="row d-grid btn btn-success col-md-2 col-4 m-auto"
        data-bs-toggle="modal"
        data-bs-target="#AddModal"
      >
        Add new Item
      </div>
      <Modal
        mode="Create"
        title="Add new Item"
        id="AddModal"
        func={(e) => CreateItem(e)}
        idform="Addform"
        btn="Add Item"
      />
      <div className="container">
        <div className="row mt-5" style={{ fontSize: "1.5rem" }}>
          Temporary saved items
        </div>
        <div className="row">
          {InactiveItems.map((item, i) => (
            <div key={item.ItemID}>
              {DisplayItem(item)}
              <div className="row">
                <div className="col-sm-6 col-12 mt-4 mb-4 mt-3">
                  <div
                    className="btn btn-primary col-sm-3 col-5"
                    data-bs-toggle="modal"
                    data-bs-target={"#ActivateItem" + i}
                  >
                    Finalize
                  </div>

                  <div
                    className="btn btn-warning col-sm-2 col-3 ms-1"
                    data-bs-toggle="modal"
                    data-bs-target={"#EditModal" + i}
                  >
                    Edit
                  </div>
                  <div
                    className="btn btn-danger col-sm-2 col-4 ms-1"
                    onClick={() => DeleteItem(item.ItemID)}
                  >
                    Delete
                  </div>
                </div>
              </div>
              <Modal
                mode="Finalize"
                title="Make item public and start auction"
                id={"ActivateItem" + i}
                func={() => ActivateItem(item.ItemID)}
                func2={(e) => setTime(e.target.value)}
                btn="Start Auction"
              />
              <Modal
                mode="Edit"
                title="Edit Item"
                id={"EditModal" + i}
                func={(e) => EditItem(e, item.ItemID)}
                idform={"Editform" + i}
                btn="Save changes"
              />
            </div>
          ))}
        </div>
        <hr></hr>
        <div className="row mt-5" style={{ fontSize: "1.5rem" }}>
          Items on auction
        </div>
        <div className="row">
          {ActiveItems.map((item, i) => (
            <div key={item.ItemID}>{DisplayItem(item)}</div>
          ))}
        </div>
        <hr></hr>
        <div className="row mt-5" style={{ fontSize: "1.5rem" }}>
          Items with your bids
        </div>
        <div className="row">
          {biddeditems.map((item, i) => (
            <div key={item.ItemID}>{DisplayItem(item)}</div>
          ))}
        </div>
      </div>

      <div style={{ height: "5rem" }}></div>
      {loading ? null : <Footer class="CustomFooter2" />}
    </div>
  );
};
