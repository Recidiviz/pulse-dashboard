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

import downloadjs from 'downloadjs';
import { timeStamp } from './time';

function downloadCanvasImage(canvas, filename) {
  const data = canvas.toDataURL('image/png;base64');
  downloadjs(data, filename, 'image/png;base64');
}

function downloadObjectAsJson(exportObj, exportName) {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportObj, null, '\t'))}`;
  const filename = `${exportName}.json`;
  downloadjs(dataStr, filename, 'text/json');
}

function configureDownloadButtons(
  chartId, chartDatasets, chartLabels, chartBox,
  exportedStructureCallback, convertValuesToNumbers,
) {
  const downloadChartAsImageButton = document.getElementById(`downloadChartAsImage-${chartId}`);
  if (downloadChartAsImageButton) {
    downloadChartAsImageButton.onclick = function downloadChartImage() {
      downloadCanvasImage(chartBox, `${chartId}-${timeStamp()}.png`);
    };
  }

  const downloadChartDataButton = document.getElementById(`downloadChartData-${chartId}`);
  if (downloadChartDataButton) {
    downloadChartDataButton.onclick = function downloadChartData() {
      const exportData = exportedStructureCallback();

      chartDatasets.forEach((dataset) => {
        if (dataset.label !== 'trendline') {
          const values = {};
          let i = 0;
          dataset.data.forEach((dataPoint) => {
            if (convertValuesToNumbers === undefined || convertValuesToNumbers) {
              values[chartLabels[i]] = Number(dataPoint);
            } else {
              values[chartLabels[i]] = dataPoint;
            }
            i += 1;
          });

          exportData.series.push({
            label: dataset.label,
            values,
          });
        }
      });

      const filename = `${chartId}-${timeStamp()}`;
      downloadObjectAsJson(exportData, filename);
    };
  }
}

export {
  downloadCanvasImage,
  downloadObjectAsJson,
  configureDownloadButtons,
};
