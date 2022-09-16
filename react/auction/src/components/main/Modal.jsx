import React from "react";
import { useState } from "react";
import { useEffect } from "react";

export const Modal = (props) => {
  const [btnclass, setBtnclass] = useState("");

  useEffect(() => {
    if (props.mode === "Create") {
      setBtnclass("btn btn-success");
    } else if (props.mode === "Edit") {
      setBtnclass("btn btn-primary");
    }
  }, [props.id, props.mode]);

  return (
    <div>
      {props.mode === "Finalize" ? (
        <div
          className="modal fade"
          id={props.id}
          tabIndex="-1"
          aria-labelledby={props.id + "Label"}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={props.id + "Label"}>
                  Make item public and start auction
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-6">
                    <label htmlFor="EndTime">
                      Choose when auction will end:
                    </label>
                  </div>
                  <div className="col-6">
                    <input
                      type="datetime-local"
                      id="EndTime"
                      name="EndTime"
                      onChange={props.func2}
                    />
                  </div>
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
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={props.func}
                >
                  Start Auction
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="modal fade"
          id={props.id}
          tabIndex="-1"
          aria-labelledby={props.id + "Label"}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={props.id + "Label"}>
                  {props.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={props.func} id={props.idform}>
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
                        <label
                          htmlFor="InpBuyPrice"
                          className="form-label ms-1"
                        >
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
                        <label
                          htmlFor="InpFirstBid"
                          className="form-label ms-1"
                        >
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
                  form={props.idform}
                  className={btnclass}
                  data-bs-dismiss="modal"
                >
                  {props.btn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
