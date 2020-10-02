import React from "react";
import PropTypes from "prop-types";

import "./Error.scss";

import warningIcon from "../assets/static/images/warning.svg";

const Error = ({ text }) => (
  <div className="error">
    <img src={warningIcon} alt="Error icon" className="error_icon" />
    <p className="error_text">{text}</p>
  </div>
);

Error.defaultProps = {
  text:
    "Something went wrong while loading this chart. Check back later or contact feedback@recidiviz.org for more information.",
};

Error.propTypes = {
  text: PropTypes.string,
};

export default Error;
