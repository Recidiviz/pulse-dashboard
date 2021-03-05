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

import React, { useCallback, useState } from "react";
import { Collapse } from "react-bootstrap";
import PropTypes from "prop-types";

import "./ImportantNotesBar.css";

const ImportantNotesBar = ({ importantNotes }) => {
  const [isOpened, setIsOpened] = useState(false);

  const toggleIsOpened = useCallback(() => {
    setIsOpened(!isOpened);
  }, [isOpened]);

  return (
    <div className="ImportantNotesBar col-12">
      <div className="bd bgc-white pX-40 pY-20">
        <div className="w-100" id="importantNotesBar">
          <button
            className="btn btn-link pX-0 w-100 text-decoration-none"
            type="button"
            aria-expanded="true"
            aria-controls="importantNotes"
            onClick={toggleIsOpened}
          >
            <h5
              id="importantNotesBarHeading"
              className="lh-1 mB-0 text-left recidiviz-dark-green-text"
            >
              Important Notes
              <span className="ti-angle-right" />
              <span className="ti-angle-down" />
            </h5>
          </button>
          <Collapse
            in={isOpened}
            id="importantNotes"
            aria-labelledby="importantNotesBarHeading"
          >
            <div>
              <div className="bdT mT-10 pT-10">
                {importantNotes.map((note) => (
                  <p key={note.header}>
                    <span className="font-weight-bold">{`${note.header}: `}</span>
                    {note.body}
                  </p>
                ))}
              </div>
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  );
};

ImportantNotesBar.propTypes = {
  importantNotes: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string,
      body: PropTypes.string,
    })
  ).isRequired,
};

export default ImportantNotesBar;
