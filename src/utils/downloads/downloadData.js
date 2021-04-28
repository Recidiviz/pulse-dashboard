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
import * as Sentry from "@sentry/react";
import JSZip from "jszip";
import downloadjs from "downloadjs";
import exportDataOnMobileDevices, {
  isMobile,
} from "../../api/exportData/exportDataOnMobileDevices";
import transformCanvasToBase64 from "./transformCanvasToBase64";
import createMethodologyFile from "./createMethodologyFile";
import configureFilename from "./configureFileName";
import transformChartDataToCsv from "./transformChartDataToCsv";

// Functions for flowing through browser-specific download functionality
// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
const isIE = /* @cc_on!@ */ false || !!document.documentMode;
const isEdge = !isIE && !!window.StyleMedia;

async function downloadZipFile({ files, filename, getTokenSilently }) {
  const zip = new JSZip();

  files.forEach((file) => {
    if (file.type === "binary") {
      zip.file(file.name, file.data, { binary: true });
    } else if (file.type === "base64") {
      zip.file(file.name, file.data, { base64: true });
    } else {
      throw new Error("File type not supported.");
    }
  });

  if (isMobile) {
    const content = await zip.generateAsync({ type: "blob" });
    const formData = new FormData();
    formData.append("zip", content, filename);
    await exportDataOnMobileDevices(formData, filename, getTokenSilently);
  } else {
    zip.generateAsync({ type: "blob" }).then(function (content) {
      downloadjs(content, filename);
    });
  }
}

export function downloadCanvasAsImage({
  canvas,
  filename,
  chartTitle,
  filters,
  violation,
  chartId,
  timeWindowDescription,
  shouldZipDownload,
  methodology,
  getTokenSilently,
}) {
  const imageData = transformCanvasToBase64(
    canvas,
    chartTitle,
    filters,
    violation
  );
  try {
    if (shouldZipDownload || isMobile) {
      const methodologyFile =
        shouldZipDownload &&
        createMethodologyFile(
          chartTitle,
          timeWindowDescription,
          filters,
          methodology,
          violation
        );

      const files = [
        {
          name: filename,
          data: imageData.substring(22),
          type: "base64",
        },
      ];

      if (methodologyFile) {
        files.push(methodologyFile);
      }

      downloadZipFile({
        files,
        filename: "export_image.zip",
        getTokenSilently,
      });
    } else {
      downloadjs(imageData, filename, "image/png;base64");
    }
  } catch (error) {
    console.error(error);
    Sentry.captureException(error, (scope) => {
      scope.setContext("downloadCanvasAsImage", {
        chartId,
        filename,
        shouldZipDownload,
      });
    });
  }
}

export function downloadData({
  shouldZipDownload,
  fileContents,
  chartId,
  getTokenSilently,
  methodologyFile = null,
}) {
  try {
    if (shouldZipDownload || isMobile) {
      const files = fileContents.map((file) => {
        return {
          name: file.filename,
          data: file.csv,
          type: "binary",
        };
      });

      if (methodologyFile) {
        files.push(methodologyFile);
      }

      downloadZipFile({
        files,
        filename: "export_data.zip",
        getTokenSilently,
      });
    } else if (isIE || isEdge) {
      fileContents.forEach((file) => {
        const blob = new Blob([file.csv], {
          type: "text/csv;charset=utf-8;",
        });
        navigator.msSaveBlob(blob, file.filename);
      });
    } else {
      fileContents.forEach((file) => {
        const encodedCsv = encodeURIComponent(file.csv);
        const dataStr = `data:text/csv;charset=utf-8,${encodedCsv}`;
        downloadjs(dataStr, file.filename, "text/csv");
      });
    }
  } catch (error) {
    console.error(error);
    Sentry.captureException(error, (scope) => {
      scope.setContext("downloadData", {
        chartId,
        filename: "filename",
        shouldZipDownload,
      });
    });
  }
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

export function configureDataDownloadButton({
  fileContents,
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
    const methodologyFile =
      shouldZipDownload &&
      createMethodologyFile(
        chartTitle,
        timeWindowDescription,
        filters,
        methodology
      );
    const promises = fileContents.map((file) => {
      return transformChartDataToCsv(
        file.chartDatasets,
        file.chartLabels,
        dataExportLabel,
        convertValuesToNumbers,
        fixLabelsInColumns
      );
    });
    Promise.all(promises).then((csvs) => {
      downloadData({
        shouldZipDownload,
        fileContents: csvs.map((csv, index) => {
          const filename = configureFilename(
            fileContents[index].chartId,
            filters,
            shouldZipDownload
          );
          return {
            csv,
            filename: `${filename}.csv`,
          };
        }),
        getTokenSilently,
        methodologyFile,
      });
    });
  };
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
    filters: filters.filtersDescription,
    violation: filters.violationTypeDescription,
    chartId,
    timeWindowDescription,
    shouldZipDownload,
    methodology,
    getTokenSilently,
  });
}

export function downloadChartAsData({
  chartTitle,
  fileContents,
  dataExportLabel,
  filters = null,
  timeWindowDescription = null,
  shouldZipDownload,
  fixLabelsInColumns = false,
  methodology,
  getTokenSilently,
}) {
  const downloadChartData = configureDataDownloadButton({
    fileContents,
    dataExportLabel,
    filters: filters && filters.filtersDescription,
    violation: filters && filters.violationTypeDescription,
    chartTitle,
    timeWindowDescription,
    shouldZipDownload,
    fixLabelsInColumns,
    methodology,
    getTokenSilently,
  });
  downloadChartData();
}
