import React from "react";
import "./Pending.css";
import { Link } from "react-router-dom";

export const Pending = () => {
  return (
    <div className="PendingPage">
      <p className="custom-text text-center">
        <h1>
          Thank you for your submission. Your application's approval is pending
        </h1>
        <h2 className="pt-5">While you are waiting, you can visit our <Link to={"/home/"} className="link">home</Link> page as a guest</h2>
      </p>
    </div>
  );
};
