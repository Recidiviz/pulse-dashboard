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

import React, { useState } from 'react';

import {
  configureDownloadButtons, configureDownloadButtonsRegularElement,
} from '../../assets/scripts/utils/downloads';
import { chartIdToInfo } from '../../utils/charts/info';

const ExportMenu = (props) => {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const additionalInfo = chartIdToInfo[props.chartId] || [];

  const menuSpan = (
    <span className="fa-pull-right">
      <div className="dropdown show">
        <a href="#" role="button" id={`exportDropdownMenuButton-${props.chartId}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          ...
        </a>
        <div className="dropdown-menu dropdown-menu-right" aria-labelledby={`exportDropdownMenuButton-${props.chartId}`}>
          <a className="dropdown-item" href="javascript:void(0);" onClick={() => toggleAdditionalInfoModal()}>Additional info</a>
          {(props.shouldExport === undefined || props.shouldExport === true) && (
            <a className="dropdown-item" id={`downloadChartAsImage-${props.chartId}`} href="javascript:void(0);">Export image</a>
          )}
          {(props.shouldExport === undefined || props.shouldExport === true) && (
            <a className="dropdown-item" id={`downloadChartData-${props.chartId}`} href="javascript:void(0);">Export data</a>
          )}
        </div>
      </div>

      {showAdditionalInfo && (
        <div className="modal-container overflow-auto p-20">
          <h5>About this chart</h5>
          {additionalInfo.length > 0 ? (
            <ul>
              {additionalInfo.map((info, i) => (
                <li key={i} className="mY-20">
                  {info}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              There is no additional information for this chart.
            </p>
          )}
          <div className="ta-r">
            <button className="btn btn-link" onClick={() => toggleAdditionalInfoModal()}>Close</button>
          </div>
        </div>
      )}
    </span>
  );

  function toggleAdditionalInfoModal() {
    setShowAdditionalInfo(!showAdditionalInfo);
  }

  if ((props.shouldExport === undefined || props.shouldExport === true)) {
    const exportedStructureCallback = () => (
      {
        metric: props.metricTitle,
        series: [],
      });

    if (props.regularElement) {
      configureDownloadButtonsRegularElement(props.chartId, props.metricTitle,
        props.elementDatasets, props.elementLabels,
        document.getElementById(props.chartId), exportedStructureCallback, {});
    } else {
      configureDownloadButtons(props.chartId, props.metricTitle,
        props.chart.props.data.datasets, props.chart.props.data.labels,
        document.getElementById(props.chartId), exportedStructureCallback, {});
    }
  }

  return menuSpan;
};

export default ExportMenu;
