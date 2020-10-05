import React from "react";
import PropTypes from "prop-types";

import "./Error.scss";

import warningIcon from "../assets/static/images/warning.svg";

const Error = ({ text }) => (
  <div className="Error">
    <img src={warningIcon} alt="Error icon" className="Error__icon" />
    <p className="Error__text">{text}</p>
  </div>
);

Error.defaultProps = {
  text: (
    <>
      Something went wrong while loading this chart. Check back later or contact{" "}
      <a href="mailto:feedback@recidiviz.org">feedback@recidiviz.org</a>
      for more information.
    </>
  ),
};

Error.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default Error;
