import "./Error.scss";

import PropTypes from "prop-types";
import React from "react";

import warningIcon from "../assets/static/images/warning.svg";

const ErrorMessage = ({ error }) => {
  return (
    <div className="Error">
      <img src={warningIcon} alt="Error icon" className="Error__icon" />
      <p className="Error__text">{error.toString()}</p>
      <p className="Error__text">
        Check back later or contact{" "}
        <a href="mailto:feedback@recidiviz.org">feedback@recidiviz.org</a> if
        the issue continues.
      </p>
    </div>
  );
};

ErrorMessage.defaultProps = {
  error: new Error("Something went wrong while loading this chart."),
};

ErrorMessage.propTypes = {
  error: PropTypes.instanceOf(Error),
};

export default ErrorMessage;
