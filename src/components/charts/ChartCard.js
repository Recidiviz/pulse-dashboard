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

import TenantExportMenu from "./TenantExportMenu";
import GeoViewToggle from "../toggles/GeoViewToggle";

const ChartCard = ({
  chart,
  chartId,
  chartTitle,
  hasExport,
  footer = null,
  geoChart = null,
  geoFooter = null,
}) => {
  const [geoViewEnabled, setGeoViewEnabled] = useState(false);

  const isGeoViewAvailable = !!geoChart;
  const chartType = geoViewEnabled ? "svg" : "canvas";

  return (
    <div className="col-md-6">
      <div className="bd bgc-white p-20">
        <div className="layers">
          <div className="layer w-100 pX-20 pT-20">
            <h6 className="lh-1">
              {chartTitle}
              <span className="fa-pull-right">
                {isGeoViewAvailable && (
                  <div className="geo-view-button pR-10">
                    <GeoViewToggle setGeoViewEnabled={setGeoViewEnabled} />
                  </div>
                )}

                {hasExport === true && (
                  <TenantExportMenu chartId={chartId} chartType={chartType} />
                )}
              </span>
            </h6>
          </div>
          <div className="layer w-100 pX-20 pT-20">
            {geoViewEnabled === false && (
              <div className="dynamic-chart-header" id={`${chartId}-header`} />
            )}
          </div>

          <div className="layer w-100 p-20 fs-block">
            {isGeoViewAvailable && geoViewEnabled ? geoChart : chart}
          </div>

          {geoViewEnabled && geoFooter ? geoFooter : footer}
        </div>
      </div>
    </div>
  );
};

ChartCard.defaultProps = {
  footer: null,
  geoChart: null,
  geoFooter: null,
  hasExport: true,
};

ChartCard.propTypes = {
  chart: PropTypes.node.isRequired,
  chartId: PropTypes.string.isRequired,
  chartTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
    .isRequired,
  footer: PropTypes.node,
  geoChart: PropTypes.node,
  geoFooter: PropTypes.node,
  hasExport: PropTypes.bool,
};

export default ChartCard;
