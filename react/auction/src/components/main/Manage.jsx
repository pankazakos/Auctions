import React from "react";
import "./Manage.css";
import { Header } from "./Header";
import { Footer } from "./Footer";

const SubmitModal = (event) => {
  event.preventDefault();
  console.log("hello");
};

export const Manage = () => {
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
                  <div className="col-md-9 col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        id="Nameinp"
                        className="form-control"
                        placeholder="Name"
                      />
                      <label htmlFor="Nameinp" className="form-label ms-1">
                        Name
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-3 col-12">
                    <div className="form-floating">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        id="BuyPriceinp"
                        className="form-control"
                        placeholder="Buy Price"
                      />
                      <label htmlFor="BuyPriceinp" className="form-label ms-1">
                        Buy Price
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 col-12 mt-md-0 mt-3">
                    <div className="form-floating">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        id="First_Bidinp"
                        className="form-control"
                        placeholder="First Bid"
                      />
                      <label htmlFor="First_Bidinp" className="form-label ms-1">
                        First Bid
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3 col-12 mt-md-0 mt-3">
                    <div className="form-floating">
                      <input
                        type="number"
                        min="1"
                        id="num_bidsinp"
                        className="form-control"
                        placeholder="Number of Bids"
                      />
                      <label htmlFor="num_bidsinp" className="form-label ms-1">
                        Number of Bids
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-9 col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        id="categoriesinp"
                        className="form-control"
                        placeholder="Categories"
                      />
                      <label
                        htmlFor="categoriesinp"
                        className="form-label ms-1"
                      >
                        Categories
                      </label>
                    </div>
                  </div>
                  <div className="col-12 mt-1">(Separate with commas)</div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-9 col-12">
                    <div className="form-floating">
                      <textarea
                        type="textarea"
                        id="Descriptioninp"
                        className="form-control"
                        placeholder="Description"
                        style={{ height: "12rem" }}
                      ></textarea>
                      <label
                        htmlFor="Descriptioninp"
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
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
