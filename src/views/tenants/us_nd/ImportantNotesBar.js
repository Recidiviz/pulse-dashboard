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


const ImportantNotesBar = (props) => {
  const { importantNotes } = props;

  return (
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
              {importantNotes.map((note, i) => (
                <p key={i}>
                  <span className="font-weight-bold">{note.header}: </span>
                  {note.body}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportantNotesBar;
