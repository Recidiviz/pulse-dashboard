import React from "react";

import "./Error.scss";

import warningIcon from "../assets/static/images/warning.svg";

const Error = ({
  text = "Oops... Something went wrong. Check console for detailed info.",
}) => (
  <div className="error">
    <img src={warningIcon} alt="Error icon" className="error_icon" />
    <p className="error_text">{text}</p>
  </div>
);

export default Error;
