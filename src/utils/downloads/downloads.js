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

import JsFileDownloader from "js-file-downloader";

import getTimeStamp from "./getTimeStamp";
import configureFilename from "./configureFileName";
import createMethodologyFile from "./createMethodologyFile";
import downloadZipFile from "./downloadZipFile";
import transformChartDataToCsv from "./transformChartDataToCsv";
import downloadCanvasAsImage from "./downloadCanvasAsImage";

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
          filters
        );
        const files = [
          methodologyFile,
          {
            name: exportName,
            data: csv,
            type: "binary",
          },
        ];

        downloadZipFile(files, "export_data.zip");
      } else if (isIE || isEdge) {
        const blob = new Blob([csv], {
          type: "text/csv;charset=utf-8;",
        });
        navigator.msSaveBlob(blob, exportName);
      } else {
        const encodedCsv = encodeURIComponent(csv);
        const dataStr = `data:text/csv;charset=utf-8,${encodedCsv}`;
        const jsFileDownload = new JsFileDownloader({
          autoStart: false,
          url: dataStr,
          filename: exportName,
        });
        jsFileDownload.start();
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
  });
  downloadChartData();
}
