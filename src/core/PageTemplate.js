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

import React from "react";
import PropTypes from "prop-types";

import ImportantNotesBar from "./ImportantNotesBar";
import "../assets/styles/index.scss";

const PageTemplate = ({ children, importantNotes, toggleBar = null }) => (
  <>
    {toggleBar}
    <main className="main-content bgc-grey-100">
      <div id="mainContent">
        <div
          className="row gap-20 pos-r"
          style={{ overflow: "initial !important" }}
        >
          {importantNotes.length !== 0 && (
            <ImportantNotesBar importantNotes={importantNotes} />
          )}

          {children}
        </div>
      </div>
    </main>
  </>
);

PageTemplate.defaultProps = {
  importantNotes: [],
  toggleBar: null,
};

PageTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  importantNotes: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
    }).isRequired
  ),
  toggleBar: PropTypes.node,
};

export default PageTemplate;
