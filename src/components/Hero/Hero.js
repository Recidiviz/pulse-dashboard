import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Hero.css';

import activateBounce from '../../lib/static/letterBounce';

const propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

class Hero extends Component {
  componentDidMount() {
    activateBounce();
  }

  render() {
    return (
      <main className="demo-moveout">
        <section className="content content--layout">
          <h2 className="word word--moveout">{this.props.title}</h2>
          <h4 className="f3 content-center: center">{this.props.description}</h4>
          <div className="flex items-center justify-center pa4 mt6 bg-alert-blue text-our-gray">
            <svg className="w1" data-icon="info" viewBox="0 0 32 32">
              <title>info icon</title>
              <path d="M16 0 A16 16 0 0 1 16 32 A16 16 0 0 1 16 0 M19 15 L13 15 L13 26 L19 26 z M16 6 A3 3 0 0 0 16 12 A3 3 0 0 0 16 6" />
            </svg>
            <span className="lh-title ml3">We&apos;re building some exciting tools in this space; stay tuned. <br /> Meanwhile, play around with existing datasets below or <a href="mailto:team@recidiviz.com">contact us.</a></span>
          </div>
        </section>
      </main>
    );
  }
}

Hero.propTypes = propTypes;

export default Hero;
