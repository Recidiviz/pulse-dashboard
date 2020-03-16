// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import React from 'react';
import '../../../assets/styles/index.scss';
import './ImportantNotesBar.css';


const ImportantNotesBar = () => (
  <div className="col-12">
    <div className="bd bgc-white pX-40 pY-20">
      <div className="w-100" id="importantNotesBar">
        <button className="btn btn-link collapsed pX-0 w-100 text-decoration-none" type="button" data-toggle="collapse"
                data-target="#importantNotes" aria-expanded="true"
                aria-controls="importantNotes">
          <h5 id="importantNotesBarHeading" className="lh-1 mB-0 text-left recidiviz-dark-green-text">
            Important Notes
            <span className="ti-angle-right"></span>
            <span className="ti-angle-down"></span>
          </h5>
        </button>
        <div id="importantNotes" className="collapse" aria-labelledby="importantNotesBarHeading"
             data-parent="#importantNotesBar">
          <div className="bdT mT-10 pT-10">
            <p>
              <span className="font-weight-bold">PERSON-BASED COUNTING</span>: In collaboration with Central Office,
              Recidiviz has decided to emphasize the counting of people rather than cases. Unless noted otherwise, all
              our data focused on the number of people who successfully complete supervision, or the number of people
              admitted to prison because of a revocation. If an individual has multiple cases terminated differently
              (e.g., one expires and one ends via revocation) an individual will be counted towards all numbers for
              which at least one case is relevant (in that case, the individual would count towards successful
              terminations because of the expired case, and towards revocations because of the revoked case).
            </p>
            <p>
              <span className="font-weight-bold">REVOCATIONS TO DOCR FACILITY</span>: In conjunction with North Dakota
              priorities, Recidiviz looks specifically at revocations to DOCR facilities. Revocations resulting in other
              dispositions are not counted. In addition, revocations are counted only when an individual’s admittance to
              a facility is documented in Elite as a revocation. Individuals whose revocations result in continuation or
              a sentence to a county jail are not included in revocation charts, unless noted otherwise for the chart.
              Individuals sentenced to a DOCR facility but who are not ultimately incarcerated in a DOCR facility are
              not counted (this may happen, for example, if they serve significant time in a county jail prior to being
              returned to prison). Individuals who are booked with an admission reason of new admission are not counted
              as revocations, even if a recent supervision sentence ended with a revocation with a sentence to DOCR
              facility disposition.
            </p>
            <p>
              <span className="font-weight-bold">DATA PULLED FROM ELITE & DOCSTARS</span>: Our data is updated nightly
              using information pulled from Elite and Docstars.
            </p>
            <p>
              <span className="font-weight-bold">LEARN MORE</span>: Click on “Methodology” for a given chart to read
              more about how it was generated.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);


export default ImportantNotesBar;
