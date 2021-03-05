// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
import configureFilename from "./configureFileName";
import createMethodologyFile from "./createMethodologyFile";
import transformChartDataToCsv from "./transformChartDataToCsv";
import { downloadData, downloadCanvasAsImage } from "../../api/exportData";
import getFilterDescription from "../../RootStore/utils/getFilterDescription";

// Used for both Core and Lantern layouts
export function configureDataDownloadButton({
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
  getTokenSilently,
}) {
  return () => {
    const filename = configureFilename(chartId, filters, shouldZipDownload);
    const exportName = `${filename}.csv`;
    const methodologyFile =
      shouldZipDownload &&
      createMethodologyFile(
        chartId,
        chartTitle,
        timeWindowDescription,
        filters,
        methodology,
        violation
      );
    transformChartDataToCsv(
      chartDatasets,
      chartLabels,
      dataExportLabel,
      convertValuesToNumbers,
      fixLabelsInColumns
    ).then((csv) => {
      downloadData({
        chartId,
        shouldZipDownload,
        csv,
        getTokenSilently,
        methodologyFile,
        filename: exportName,
      });
    });
  };
}

//  Used only in Core layout
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
        filters: filters.filtersDescription,
        violation: filters.violationTypeDescription,
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
      filters: getFilterDescription(filters),
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
        filters: getFilterDescription(filters),
        timeWindowDescription,
        shouldZipDownload,
        getTokenSilently,
      });
    };
  }
}

// Used for both Core and Lantern layouts
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
      filename: `${configureFilename(chartId, {}, true)}.png`,
      chartTitle,
      filters: filters.filtersDescription,
      violation: filters.violationTypeDescription,
      chartId,
      timeWindowDescription,
      shouldZipDownload,
      methodology,
      getTokenSilently,
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
  getTokenSilently,
}) {
  const filename = configureFilename(chartId, filters, shouldZipDownload);
  downloadCanvasAsImage({
    canvas: document.getElementById(chartId),
    filename: `${filename}.png`,
    chartTitle,
    filters: filters.filtersDescription,
    violation: filters.violationTypeDescription,
    chartId,
    timeWindowDescription,
    shouldZipDownload,
    methodology,
    getTokenSilently,
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
  getTokenSilently,
}) {
  const downloadChartData = configureDataDownloadButton({
    chartId,
    chartDatasets,
    chartLabels,
    dataExportLabel,
    filters: filters.filtersDescription,
    violation: filters.violationTypeDescription,
    chartTitle,
    timeWindowDescription,
    shouldZipDownload,
    fixLabelsInColumns,
    methodology,
    getTokenSilently,
  });
  downloadChartData();
}
