import React, { Component } from 'react';

import NLForm from '../../../lib/static/nlform';
import stateSelect from '../../../lib/static/stateRecidivismRandom';

import '../RecidivizForm/RecidivizForm.css';
import './RecidivizTable.css';

const states = [
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Georgia',
  'Utah',
  'Washington',
];

class RecidivizTable extends Component {
  componentDidMount() {
    const nlformState = new NLForm(document.getElementById('nl-form-state'), stateSelect);
    stateSelect(nlformState);
  }

  render() {
    const selectStyle = { outline: 'none' };

    return (
      <article className="cf ph3 ph5-ns pb5 bg-white black-70">
        <div className="mw9 center pa3 pa5-ns">
          <article className="pv2 fl w-100">
            <h1 className="f4 fw6 f1-ns lh-title measure mt0 text-our-gray">Compare Prisons</h1>
            <form className="nl-form text-our-gray" id="nl-form-state">
              Show me the prisons in&nbsp;
              <select id="state-prisons-selector" style={selectStyle}>
                {
                  states.map(state => (
                    <option value={state} key={state}>
                      {state}
                    </option>
                  ))
                }
              </select>
              <div className="nl-overlay" />
              &nbsp;ranked by their recidivism rates
            </form>
            <div id="state-prisons-table" className="pt4" />
          </article>
        </div>
      </article>
    );
  }
}

export default RecidivizTable;
