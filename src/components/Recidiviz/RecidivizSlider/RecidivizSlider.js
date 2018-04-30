import React, { Component } from 'react';

import './RecidivizSlider.css';
import addRecidivismSlider from '../../../lib/static/recidivismSlider';

class RecidivizSlider extends Component {
  componentDidMount() {
    addRecidivismSlider();
  }

  render() {
    return (
      <article className="bt b--black-10 black-70 ph3 ph5-ns pt2 pt3-ns">
        <div className="mw9 center pa3 pa5-ns flex flex-column items-center" id="first-chart">
          <div className="w-75">
            <h1 className="tc f5 fw6 f2-ns lh-title measure text-our-gray">
              If 100 people were released from prison today...
            </h1>
          </div>
          <div className="w-75">
            <h1 className="f5 fw6 f2-ns tc text-our-gray" id="sliderLabel">
                (drag the slider)
            </h1>
          </div>
        </div>
      </article>
    );
  }
}

export default RecidivizSlider;
