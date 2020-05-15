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

import React, { useState } from "react";
import PropTypes from "prop-types";

const MetholodgyCollapse = ({ children }) => {
  const [id] = useState(`_${Math.random().toString(36).substr(2, 9)}`);

  return (
    <div className="layer bdT p-20 w-100 accordion" id={`methodology${id}`}>
      <div className="mb-0" id={`methodologyHeading${id}`}>
        <div className="mb-0">
          <button
            className="btn btn-link collapsed pL-0"
            type="button"
            data-toggle="collapse"
            data-target={`#collapseMethodology${id}`}
            aria-expanded="true"
            aria-controls={`collapseMethodology${id}`}
          >
            <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
          </button>
        </div>
      </div>
      <div
        id={`collapseMethodology${id}`}
        className="collapse"
        aria-labelledby={`methodologyHeading${id}`}
        data-parent={`#methodology${id}`}
      >
        {children}
      </div>
    </div>
  );
};

MetholodgyCollapse.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MetholodgyCollapse;
