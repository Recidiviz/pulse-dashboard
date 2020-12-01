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
import { Dropdown } from "react-bootstrap";

const ChartCardExportMenu = ({ chartId, chartType }) => {
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
    <Dropdown className="export-button">
      <Dropdown.Toggle
        variant="secondary"
        size="sm"
        id={`exportDropdownMenuButton-${chartId}`}
      >
        Export
      </Dropdown.Toggle>
      <Dropdown.Menu
        renderOnMount
        aria-labelledby={`exportDropdownMenuButton-${chartId}`}
      >
        <Dropdown.Item
          as="button"
          id={`${getDownloadFunctionName()}-${chartId}`}
        >
          Export image
        </Dropdown.Item>
        <Dropdown.Item as="button" id={`downloadChartData-${chartId}`}>
          Export data
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

ChartCardExportMenu.propTypes = {
  chartId: PropTypes.string.isRequired,
  chartType: PropTypes.oneOf(["canvas", "svg"]).isRequired,
};

export default ChartCardExportMenu;
