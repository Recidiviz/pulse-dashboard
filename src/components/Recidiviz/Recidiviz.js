import React from 'react';
import PropTypes from 'prop-types';

import RecidivizIntro from './RecidivizIntro';

const propTypes = {
  type: PropTypes.string.isRequired,
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function Recidiviz(props) {
  return (
    <section className="bg-black-0125 w-100">
      <article className="bt b--black-10 black-70 bg-our-gray ph3 ph5-ns pv4 pv5-ns">
        <RecidivizIntro description={props.description} />
      </article>
      {props.type}
    </section>
  );
}

Recidiviz.propTypes = propTypes;

export default Recidiviz;
