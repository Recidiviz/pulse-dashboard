/*
 * Recidiviz - a platform for tracking granular criminal justice metrics in real time
 * Copyright (C) 2018 Recidiviz, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * ============================================================================
*/

import React, { Component } from 'react';

import NLForm from '../../../lib/static/js/nlform';
import likelihoodSelect from '../../../lib/static/js/likelihoodSelect';

import '../../../lib/static/css/nlform.css';

const ageOptions = [
  {
    value: '24 or younger',
    text: 'less than 24',
  },
  {
    value: '25 to 29',
    text: '25 - 29',
  },
  {
    value: '30 to 34',
    text: '30 - 34',
  },
  {
    value: '35 to 39',
    text: '35 - 39',
  },
  {
    value: '40 or older',
    text: '40+',
  },
];

const raceOptions = [
  {
    value: 'Hispanic/Latino',
    text: 'latino(a)',
  },
  {
    value: 'White',
    text: 'white',
  },
  {
    value: 'Black/African American',
    text: 'black',
  },
  {
    value: 'Other',
    text: 'other',
  },
];

const sexOptions = [
  {
    value: 'Female',
    text: 'woman',
  },
  {
    value: 'Male',
    text: 'man',
  },
  {
    value: 'Missing',
    text: 'other',
  },
];

const historyOptions = [
  {
    value: '4 or fewer',
    text: 'less than 4',
  },
  {
    value: '5 to 9',
    text: 'between 5 and 9',
  },
  {
    value: '10 or more',
    text: '10 or more',
  },
];

const offenseOptions = [
  {
    value: 'Homicide',
    text: 'homicide',
  },
  {
    value: 'Rape/Sexual Assault',
    text: 'sexual assault',
  },
  {
    value: 'Robbery',
    text: 'robbery',
  },
  {
    value: 'Assault',
    text: 'assault',
  },
  {
    value: 'Other Violent Crime',
    text: 'violent crime',
  },
  {
    value: 'Drug Trafficking',
    text: 'drug trafficking',
  },
  {
    value: 'Burglary',
    text: 'burglary',
  },
  {
    value: 'Fraud/Forgery',
    text: 'fraud or forgery',
  },
  {
    value: 'Larceny and Motor Vehicle Theft',
    text: 'larceny or theft',
  },
  {
    value: 'Other Property',
    text: 'property crime',
  },
  {
    value: 'Drug Possession',
    text: 'drug possession',
  },
  {
    value: 'Other Public-Order',
    text: 'public order crime',
  },
  {
    value: 'Weapons',
    text: 'weapons',
  },
  {
    value: 'DUI',
    text: 'DUI',
  },
];

class RecidivizForm extends Component {
  componentDidMount() {
    const nlformLikelihood = new NLForm(document.getElementById('nl-form-likelihood'), likelihoodSelect);
    likelihoodSelect(nlformLikelihood);
  }

  render() {
    const selectStyle = { outline: 'none' };

    return (
      <article className="cf ph3 ph5-ns pb5 bg-white black-70">
        <div className="mw9 center pa3 pa5-ns">
          <article className="pv2 fl w-100">
            <h1 className="f4 fw6 f1-ns lh-title measure mt0 text-our-gray">Try Your Luck</h1>

            <p className="f5 f4-ns lh-copy mt0 text-our-gray">
              A prisoner&apos;s age, race, gender, and offense tell us something about how likely
              they are to end up back in prison -- and how quickly.
            </p>
            <div className="pb3">
              <form className="nl-form text-our-gray" id="nl-form-likelihood">I am&nbsp;
                <select name="age" style={selectStyle}>
                  {ageOptions.map(option => (
                    <option value={option.value} key={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
                &nbsp;years old. I am a&nbsp;
                <select name="race" style={selectStyle}>
                  {raceOptions.map(option => (
                    <option value={option.value} key={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
                &nbsp;
                <select name="sex" style={selectStyle}>
                  {sexOptions.map(option => (
                    <option value={option.value} key={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
                &nbsp;who has previously been arrested&nbsp;
                <select name="history" style={selectStyle}>
                  {historyOptions.map(option => (
                    <option value={option.value} key={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
                &nbsp;times. If I am released from prison after serving time for&nbsp;
                <select name="offense" style={selectStyle}>
                  {offenseOptions.map(option => (
                    <option value={option.value} key={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
                , I will probably be back in prison in...
                <div className="nl-overlay" />
              </form>
              <div id="nl-form-likelihood-results" className="likelihood-results pt4" />
            </div>
          </article>
        </div>
      </article>
    );
  }
}

export default RecidivizForm;
