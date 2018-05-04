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

import React from 'react';

const RECIDIVIZ_FACTS = [
  '95% of the roughly 2 million inmates in US correctional custody will one day be released.',
  'Depending on who you ask, between 30% and 77% of those prisoners will end up back in prison. The Bureau of Justice Statistics\' most recent study found a 3-year recidivism rate of 67.8% across 30 states.',
  'The graphics below are based on BJS\'s data. But these numbers are likely not quite right.',
  'Existing studies are constrained by static data collection techniques - they capture a snapshot in time, which quickly becomes stale.',
  'They\'re often forced to conflate differing definitions of recidivism, lump parole infractions in with new crimes, or forego cross-cutting comparisons altogether.',
  'And in most cases, the data collected isn\'t granular enough to be actionable.',
  'It\'s really hard to find good data on recidivism, and Recidiviz wants to help.',
  'We\'re building a platform that standardizes the way that recidivism data is collected.',
  'It should be easy for states and policy makers to access granular, accurate, real time metrics, so that they can reduce crime, reduce costs, and improve outcomes for inmates and communities.',
];

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

function Facts() {
  const factElements = buildFactElements(RECIDIVIZ_FACTS);

  return (
    <section className="bg-white w-100">
      <article className="bt b--black-10 black-70 ph3 ph5-ns pv4 pv5-ns">
        <div className="mw9 center">
          <div className="cf ph2-ns">
            {factElements}
          </div>
        </div>
      </article>
    </section>
  );
}

export default Facts;
