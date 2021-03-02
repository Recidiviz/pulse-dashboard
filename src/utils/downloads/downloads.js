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

import downloadjs from "downloadjs";

import getTimeStamp from "./getTimeStamp";
import configureFilename from "./configureFileName";
import createMethodologyFile from "./createMethodologyFile";
import downloadZipFile from "./downloadZipFile";
import transformChartDataToCsv from "./transformChartDataToCsv";
import downloadCanvasAsImage from "./downloadCanvasAsImage";
import getFilters from "../../RootStore/utils/getFilters";

// Functions for flowing through browser-specific download functionality
// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
const isIE = /* @cc_on!@ */ false || !!document.documentMode;
const isEdge = !isIE && !!window.StyleMedia;

// both
function configureDataDownloadButton({
  chartId,
  chartDatasets,
  chartLabels,
  dataExportLabel,
  filters,
  violation,
  convertValuesToNumbers,
  chartTitle,
  timeWindowDescription,
  shouldZipDownload,
  fixLabelsInColumns,
  methodology,
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
          methodology,
          violation
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
        downloadjs(dataStr, exportName, "text/csv");
      }
    });
  };
}

// ND charts
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
        filters: getFilters(filters),
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
      filters: getFilters(filters),
      convertValuesToNumbers,
      chartTitle,
      timeWindowDescription,
      shouldZipDownload,
      dataExportLabel,
      fixLabelsInColumns,
      methodology,
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
        filters: getFilters(filters),
        timeWindowDescription,
        shouldZipDownload,
      });
    };
  }
}

// BOTH
export function downloadHtmlElementAsImage({
  chartId,
  chartTitle,
  filters,
  timeWindowDescription,
  shouldZipDownload,
  methodology,
}) {
  const element = document.getElementById(chartId);

  window.html2canvas(element, {}).then((canvas) => {
    downloadCanvasAsImage({
      canvas,
      filename: `${chartId}-${getTimeStamp()}.png`,
      chartTitle,
      filters: filters.filtersString,
      violation: filters.violationString,
      chartId,
      timeWindowDescription,
      shouldZipDownload,
      methodology,
    });
  });
}

// LANTERN ONLY
export function downloadChartAsImage({
  chartId,
  chartTitle,
  filters,
  timeWindowDescription,
  shouldZipDownload,
  methodology,
}) {
  const filename = configureFilename(chartId, filters, shouldZipDownload);
  downloadCanvasAsImage({
    canvas: document.getElementById(chartId),
    filename: `${filename}.png`,
    chartTitle,
    filters: filters.filtersString,
    violation: filters.violationString,
    chartId,
    timeWindowDescription,
    shouldZipDownload,
    methodology,
  });
}

// LANTERN only
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
}) {
  const downloadChartData = configureDataDownloadButton({
    chartId,
    chartDatasets,
    chartLabels,
    dataExportLabel,
    filters: filters.filtersString,
    violation: filters.violationString,
    chartTitle,
    timeWindowDescription,
    shouldZipDownload,
    fixLabelsInColumns,
    methodology,
  });
  downloadChartData();
}
