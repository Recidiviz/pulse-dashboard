import React from 'react';
import PropTypes from 'prop-types';

import RecidivizForm from './RecidivizForm';
import RecidivizIntro from './RecidivizIntro';
import RecidivizSlider from './RecidivizSlider';
import RecidivizTable from './RecidivizTable';

const propTypes = {
  type: PropTypes.string.isRequired,
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const recidivizTypes = {
  slider: RecidivizSlider,
  form: RecidivizForm,
  table: RecidivizTable,
};

function Recidiviz(props) {
  const RecidivizComponent = recidivizTypes[props.type];

  return (
    <section className="bg-black-0125 w-100">
      <article className="bt b--black-10 black-70 bg-our-gray ph3 ph5-ns pv4 pv5-ns">
        <RecidivizIntro description={props.description} />
      </article>
      <RecidivizComponent />
    </section>
  );
}

Recidiviz.propTypes = propTypes;

export default Recidiviz;
