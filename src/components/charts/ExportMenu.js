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
import { chartIdToInfo } from '../../utils/charts/info';

const ExportMenu = (props) => {
  const additionalInfo = chartIdToInfo[props.chartId] || [];

  const modalId = `additionalInfoModal-${props.chartId}`;

  const menuSpan = (
    <span className="fa-pull-right">
      <div className="dropdown show">
        <a href="#" role="button" id={`exportDropdownMenuButton-${props.chartId}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          ...
        </a>
        <div className="dropdown-menu dropdown-menu-right" aria-labelledby={`exportDropdownMenuButton-${props.chartId}`}>
          <a className="dropdown-item" href="javascript:void(0);" data-toggle="modal" data-target={`#${modalId}`}>Additional info</a>
          {(props.shouldExport === undefined || props.shouldExport === true) && (
            <a className="dropdown-item" id={`downloadChartAsImage-${props.chartId}`} href="javascript:void(0);">Export image</a>
          )}
          {(props.shouldExport === undefined || props.shouldExport === true) && (
            <a className="dropdown-item" id={`downloadChartData-${props.chartId}`} href="javascript:void(0);">Export data</a>
          )}
        </div>
      </div>

      <div id={modalId} className="modal fade" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">About this chart</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {additionalInfo.length > 0 ? (
                <ul>
                  {additionalInfo.map((info, i) => (
                    <div key={i}>
                      <h6>{info.header}</h6>
                      <p>{info.body}</p>
                    </div>
                  ))}
                </ul>
              ) : (
                <p>
                  There is no additional information for this chart.
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </span>
  );

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
