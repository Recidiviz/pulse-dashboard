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

import { toTitleCase } from "../utils/transforms/labels";

const MethodologyCollapse = ({ children, chartId }) => {
  const [isOpened, setIsOpened] = useState(false);
  const id = toTitleCase(chartId);

  const toggleIsOpened = useCallback(() => {
    setIsOpened(!isOpened);
  }, [isOpened]);

  return (
    <div
      className="MethodologyCollapse layer bdT p-20 w-100 accordion"
      id={`methodology${id}`}
    >
      <div className="mb-0" id={`methodologyHeading${id}`}>
        <div className="mb-0">
          <button
            onClick={toggleIsOpened}
            className="btn btn-link pL-0"
            type="button"
            aria-expanded="true"
            aria-controls={`collapseMethodology${id}`}
          >
            <h6 className="lh-1 c-blue-500 mb-0">Methodology</h6>
          </button>
        </div>
      </div>
      <Collapse
        in={isOpened}
        id={`collapseMethodology${id}`}
        aria-labelledby={`methodologyHeading${id}`}
      >
        {children}
      </Collapse>
    </div>
  );
};

MethodologyCollapse.propTypes = {
  chartId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default MethodologyCollapse;
