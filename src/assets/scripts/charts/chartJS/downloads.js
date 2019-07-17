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

function downloadCanvasImage(canvas, filename) {
  // create an "off-screen" anchor tag
  const link = document.createElement('a');

  // the key here is to set the download attribute of the a tag
  link.download = filename;
  link.href = canvas.toDataURL('image/png;base64');

  // create a "fake" click-event to trigger the download
  if (document.createEvent) {
    const e = document.createEvent('MouseEvents');
    e.initMouseEvent(
      'click', true, true, window,
      0, 0, 0, 0, 0, false, false, false, false, 0, null,
    );

    link.dispatchEvent(e);
  } else if (link.fireEvent) {
    link.fireEvent('onclick');
  }
}

function downloadObjectAsJson(exportObj, exportName) {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportObj, null, '\t'))}`;

  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', `${exportName}.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox

  downloadAnchorNode.click();
  downloadAnchorNode.remove();
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
