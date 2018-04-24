import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function buildFactElements(facts) {
  const factElements = [];
  let factElementGroup = [];

  facts.forEach((fact, index) => {
    const element = (
      <p key={index.toString()} className="f5 f4-ns lh-copy mt0 text-our-gray">
        {fact}
      </p>
    );

    factElementGroup.push(element);

    if ((index + 1) % 3 === 0) {
      factElements.push(<div key={index.toString()} className="fl w-third pa2">{factElementGroup}</div>);

      factElementGroup = [];
    }
  });

  return factElements;
}

function Facts(props) {
  const factElements = buildFactElements(props.data);

  return (
    <main className="w-100 bt b--black-10 bg-white">
      <section className="bg-white w-100">
        <article className="bt b--black-10 black-70 ph3 ph5-ns pv4 pv5-ns">
          <div className="mw9 center">
            <div className="cf ph2-ns">
              {factElements}
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

Facts.propTypes = propTypes;

export default Facts;
