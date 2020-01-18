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

import React from 'react';

import {
  configureDownloadButtons, configureDownloadButtonsRegularElement,
} from '../../assets/scripts/utils/downloads';

const ExportMenu = (props) => {
  const menuSpan = (
    <span className="fa-pull-right">
      <div className="dropdown show">
        <a href="#" role="button" id={`exportDropdownMenuButton-${props.chartId}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          ...
        </a>
        <div className="dropdown-menu dropdown-menu-right" aria-labelledby={`exportDropdownMenuButton-${props.chartId}`}>
          <a className="dropdown-item" id={`downloadChartAsImage-${props.chartId}`} href="javascript:void(0);">Export image</a>
          <a className="dropdown-item" id={`downloadChartData-${props.chartId}`} href="javascript:void(0);">Export data</a>
        </div>
      </div>
    </span>
  );

  const exportedStructureCallback = () => (
    {
      metric: props.metricTitle,
      series: [],
    });

  if (props.regularElement) {
    configureDownloadButtonsRegularElement(props.chartId, props.metricTitle,
      props.elementDatasets, props.elementLabels,
      document.getElementById(props.chartId), exportedStructureCallback);
  } else {
    configureDownloadButtons(props.chartId, props.metricTitle,
      props.chart.props.data.datasets, props.chart.props.data.labels,
      document.getElementById(props.chartId), exportedStructureCallback);
  }

  return menuSpan;
};

export default ExportMenu;
