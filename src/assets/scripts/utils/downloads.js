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
import html2canvas from 'html2canvas';
import * as csvExport from 'jsonexport/dist';
import { timeStamp } from './time';

function downloadCanvasImage(canvas, filename, chartTitle) {
  const topPadding = 100;
  const temporaryCanvas = document.createElement('canvas');
  temporaryCanvas.width = canvas.width;
  temporaryCanvas.height = canvas.height + topPadding;

  // Fill the canvas with a white background and the original image
  const destinationCtx = temporaryCanvas.getContext('2d');
  destinationCtx.fillStyle = '#FFFFFF';
  destinationCtx.fillRect(0, 0, canvas.width, canvas.height + topPadding);
  destinationCtx.fillStyle = '#616161';
  destinationCtx.textAlign = 'center';
  destinationCtx.font = '30px Helvetica Neue';
  destinationCtx.fillText(chartTitle, canvas.width / 2, topPadding / 2);
  destinationCtx.drawImage(canvas, 0, topPadding);

  const data = temporaryCanvas.toDataURL('image/png;base64');
  downloadjs(data, filename, 'image/png;base64');
}

function downloadObjectAsCsv(exportObj, exportName) {
  const options = {
    mapHeaders: (header) => header.replace(/label|values./, ''),
  };

  csvExport(exportObj.series, options, (err, csv) => {
    if (err) throw err;
    const filename = `${exportName}.csv`;

    if (navigator.msSaveBlob) { // User is on Windows
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      navigator.msSaveBlob(blob, filename);
    } else {
      const encodedCsv = encodeURIComponent(csv);
      const dataStr = `data:text/csv;charset=utf-8,${encodedCsv}`;
      downloadjs(dataStr, filename, 'text/csv');
    }
  });
}

function downloadObjectAsJson(exportObj, exportName) {
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportObj, null, '\t'))}`;
  const filename = `${exportName}.json`;
  downloadjs(dataStr, filename, 'text/json');
}

function configureDataDownloadButton(
  chartId, chartDatasets, chartLabels, exportedStructureCallback, convertValuesToNumbers,
) {
  return function downloadChartData() {
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
    downloadObjectAsCsv(exportData, filename);
  };
}

function configureDownloadButtons(
  chartId, chartTitle, chartDatasets, chartLabels, chartBox,
  exportedStructureCallback, convertValuesToNumbers,
) {
  const downloadChartAsImageButton = document.getElementById(`downloadChartAsImage-${chartId}`);
  if (downloadChartAsImageButton) {
    downloadChartAsImageButton.onclick = function downloadChartImage() {
      downloadCanvasImage(chartBox, `${chartId}-${timeStamp()}.png`, chartTitle);
    };
  }

  const downloadChartDataButton = document.getElementById(`downloadChartData-${chartId}`);
  if (downloadChartDataButton) {
    downloadChartDataButton.onclick = configureDataDownloadButton(
      chartId, chartDatasets, chartLabels, exportedStructureCallback, convertValuesToNumbers,
    );
  }
}

function configureDownloadButtonsRegularElement(
  chartId, chartTitle, chartDatasets, chartLabels, chartBox,
  exportedStructureCallback, convertValuesToNumbers,
) {
  const downloadChartAsImageButton = document.getElementById(`downloadChartAsImage-${chartId}`);
  if (downloadChartAsImageButton) {
    downloadChartAsImageButton.onclick = function downloadChartImage() {
      html2canvas(document.getElementById(chartId)).then((canvas) => {
        downloadCanvasImage(canvas, `${chartId}-${timeStamp()}.png`, chartTitle);
      });
    };
  }

  const downloadChartDataButton = document.getElementById(`downloadChartData-${chartId}`);
  if (downloadChartDataButton) {
    downloadChartDataButton.onclick = configureDataDownloadButton(
      chartId, chartDatasets, chartLabels, exportedStructureCallback, convertValuesToNumbers,
    );
  }
}

export {
  downloadCanvasImage,
  downloadObjectAsCsv,
  downloadObjectAsJson,
  configureDownloadButtons,
  configureDownloadButtonsRegularElement,
};
