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
import getTimeStamp from "./getTimeStamp";
import configureFilename from "./configureFileName";
import createMethodologyFile from "./createMethodologyFile";
import transformChartDataToCsv from "./transformChartDataToCsv";
import downloadCanvasAsImage from "./downloadCanvasAsImage";
import {
  downloadZipFile,
  downloadEncodedCSV,
  downloadMsBlob,
} from "../../api/downloads/downloadFiles";

// Functions for flowing through browser-specific download functionality
// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
const isIE = /* @cc_on!@ */ false || !!document.documentMode;
const isEdge = !isIE && !!window.StyleMedia;

function configureDataDownloadButton({
  chartId,
  chartDatasets,
  chartLabels,
  dataExportLabel,
  filters,
  convertValuesToNumbers,
  chartTitle,
  timeWindowDescription,
  shouldZipDownload,
  fixLabelsInColumns,
  methodology,
  getTokenSilently,
}) {
  return () => {
    const filename = configureFilename(chartId, filters, shouldZipDownload);
    const exportName = `${filename}.csv`;

    transformChartDataToCsv(
      chartDatasets,
      chartLabels,
      dataExportLabel,
      convertValuesToNumbers,
      fixLabelsInColumns
    ).then((csv) => {
      if (shouldZipDownload) {
        const methodologyFile = createMethodologyFile(
          chartId,
          chartTitle,
          timeWindowDescription,
          filters,
          methodology
        );
        const files = [
          methodologyFile,
          {
            name: exportName,
            data: csv,
            type: "binary",
          },
        ];

        downloadZipFile(files, "export_data.zip", getTokenSilently);
      } else if (isIE || isEdge) {
        downloadMsBlob(csv, exportName);
      } else {
        downloadEncodedCSV(csv, exportName);
      }
    });
  };
}

export function downloadHtmlElementAsImage({
  chartId,
  chartTitle,
  filters,
  timeWindowDescription,
  shouldZipDownload,
  methodology,
  getTokenSilently,
}) {
  const element = document.getElementById(chartId);

  window.html2canvas(element, {}).then((canvas) => {
    downloadCanvasAsImage({
      canvas,
      filename: `${chartId}-${getTimeStamp()}.png`,
      chartTitle,
      filters,
      chartId,
      timeWindowDescription,
      shouldZipDownload,
      methodology,
      getTokenSilently,
    });
  });
}

export function configureDownloadButtons({
  chartId,
  chartTitle,
  chartDatasets,
  chartLabels,
  chartBox,
  filters,
  convertValuesToNumbers,
  timeWindowDescription,
  shouldZipDownload,
  fixLabelsInColumns = false,
  dataExportLabel = "Month",
  methodology,
  getTokenSilently,
}) {
  const filename = configureFilename(chartId, filters, shouldZipDownload);
  const downloadChartAsImageButton = document.getElementById(
    `downloadChartAsImage-${chartId}`
  );

  if (downloadChartAsImageButton) {
    downloadChartAsImageButton.onclick = function downloadChartImage() {
      downloadCanvasAsImage({
        canvas: chartBox || document.getElementById(chartId),
        filename: `${filename}.png`,
        chartTitle,
        filters,
        chartId,
        timeWindowDescription,
        shouldZipDownload,
        getTokenSilently,
      });
    };
  }

  const downloadChartDataButton = document.getElementById(
    `downloadChartData-${chartId}`
  );
  if (downloadChartDataButton) {
    downloadChartDataButton.onclick = configureDataDownloadButton({
      chartId,
      chartDatasets,
      chartLabels,
      filters,
      convertValuesToNumbers,
      chartTitle,
      timeWindowDescription,
      shouldZipDownload,
      dataExportLabel,
      fixLabelsInColumns,
      methodology,
      getTokenSilently,
    });
  }

  const downloadMapAsImageButton = document.getElementById(
    `downloadHtmlElementAsImage-${chartId}`
  );
  if (downloadMapAsImageButton) {
    downloadMapAsImageButton.onclick = function downloadMapImage() {
      downloadHtmlElementAsImage({
        chartId,
        chartTitle,
        filters,
        timeWindowDescription,
        shouldZipDownload,
        getTokenSilently,
      });
    };
  }
}

export function downloadChartAsImage({
  chartId,
  chartTitle,
  filters,
  timeWindowDescription,
  shouldZipDownload,
  methodology,
  getTokenSilently,
}) {
  const filename = configureFilename(chartId, filters, shouldZipDownload);
  downloadCanvasAsImage({
    canvas: document.getElementById(chartId),
    filename: `${filename}.png`,
    chartTitle,
    filters,
    chartId,
    timeWindowDescription,
    shouldZipDownload,
    methodology,
    getTokenSilently,
  });
}

export function downloadChartAsData({
  chartId,
  chartTitle,
  chartDatasets,
  chartLabels,
  dataExportLabel,
  filters,
  timeWindowDescription,
  shouldZipDownload,
  fixLabelsInColumns = false,
  methodology,
  getTokenSilently,
}) {
  const downloadChartData = configureDataDownloadButton({
    chartId,
    chartDatasets,
    chartLabels,
    dataExportLabel,
    filters,
    chartTitle,
    timeWindowDescription,
    shouldZipDownload,
    fixLabelsInColumns,
    methodology,
    getTokenSilently,
  });
  downloadChartData();
}
