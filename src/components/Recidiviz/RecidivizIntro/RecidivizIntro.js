import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function RecidivizIntro(props) {
  return props.description.map((paragraph, index) =>
    <p className="f5 lh-copy mt0 text-our-gray" key={index.toString()}>{paragraph}</p>);
}

RecidivizIntro.propTypes = propTypes;

export default RecidivizIntro;
