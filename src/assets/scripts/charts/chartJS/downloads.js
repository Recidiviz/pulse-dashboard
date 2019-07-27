// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2018 Recidiviz, Inc.
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

import { timeStamp } from '../../utils/time';
import downloadjs from 'downloadjs';

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
  moduleType, viewType, chart, chartBox,
  exportedStructureCallback,
) {
  const downloadChartAsImageButton = document.getElementById(`downloadChartAsImage-${moduleType}${viewType}`);
  if (downloadChartAsImageButton) {
    downloadChartAsImageButton.onclick = function downloadChartImage() {
      downloadCanvasImage(chartBox, `${moduleType}-${viewType.toLowerCase()}-${timeStamp()}.png`);
    };
  }

  const downloadChartDataButton = document.getElementById(`downloadChartData-${moduleType}${viewType}`);
  if (downloadChartDataButton) {
    downloadChartDataButton.onclick = function downloadChartData() {
      const { datasets, labels } = chart.data;

      const exportData = exportedStructureCallback();

      datasets.forEach((dataset) => {
        const countsByMonth = {};
        let i = 0;
        dataset.data.forEach((dataPoint) => {
          countsByMonth[labels[i]] = dataPoint;
          i += 1;
        });

        exportData.series.push({
          label: dataset.label,
          countsByMonth,
        });
      });

      const filename = `${moduleType}-${viewType.toLowerCase()}-${timeStamp()}`;
      downloadObjectAsJson(exportData, filename);
    };
  }
}

export {
  downloadCanvasImage,
  downloadObjectAsJson,
  configureDownloadButtons,
};
