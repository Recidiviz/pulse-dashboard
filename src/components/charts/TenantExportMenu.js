// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

const TenantExportMenu = ({ chartId, chartType }) => {
  function getDownloadFunctionName() {
    switch (chartType) {
      case "canvas":
        return "downloadChartAsImage";
      case "svg":
        return "downloadHtmlElementAsImage";
      default:
        return "downloadChartAsImage";
    }
  }

  return (
    <div className="dropdown show export-button">
      <button
        className="btn btn-secondary btn-sm dropdown-toggle"
        type="button"
        id={`exportDropdownMenuButton-${chartId}`}
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Export
      </button>
      <div
        className="dropdown-menu"
        aria-labelledby={`exportDropdownMenuButton-${chartId}`}
      >
        <button
          type="button"
          className="dropdown-item"
          id={`${getDownloadFunctionName()}-${chartId}`}
        >
          Export image
        </button>
        <button
          type="button"
          id={`downloadChartData-${chartId}`}
          className="dropdown-item"
        >
          Export data
        </button>
      </div>
    </div>
  );
};

TenantExportMenu.propTypes = {
  chartId: PropTypes.string.isRequired,
  chartType: PropTypes.oneOf(["canvas", "svg"]).isRequired,
};

export default TenantExportMenu;
