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
import csvExport from "jsonexport";
import moment from "moment";
import JSZip from "jszip";

import { timeStamp } from "./time";
import { translate } from "../../../views/tenants/utils/i18nSettings";
import getFilters from "./getFilters";
import getViolation from "./getViolation";

// Functions for flowing through browser-specific download functionality
// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
const isIE = /* @cc_on!@ */ false || !!document.documentMode;
const isEdge = !isIE && !!window.StyleMedia;

function configureFilename(chartId, filters, shouldZipDownload) {
  let filename = `${chartId}-${timeStamp()}`;
  if (shouldZipDownload) {
    return filename;
  }

  if (filters.metricType) {
    filename += `-${filters.metricType}`;
  }
  if (filters.metricPeriodMonths) {
    filename += `-${filters.metricPeriodMonths}`;
  }
  if (filters.supervisionType) {
    filename += `-${filters.supervisionType}`;
  }
  if (filters.district) {
    filename += `-${filters.district}`;
  }
  return filename;
}

export function transformCanvasToBase64(canvas, chartTitle, filters) {
  const topPadding = 120;
  const temporaryCanvas = document.createElement("canvas");
  temporaryCanvas.width = canvas.width;
  temporaryCanvas.height = canvas.height + topPadding;

  // Fill the canvas with a white background and the original image
  const destinationCtx = temporaryCanvas.getContext("2d");
  destinationCtx.fillStyle = "#FFFFFF";
  destinationCtx.fillRect(0, 0, canvas.width, canvas.height + topPadding);
  destinationCtx.fillStyle = "#616161";
  destinationCtx.textAlign = "center";
  destinationCtx.font = "30px Helvetica Neue";
  destinationCtx.fillText(chartTitle, canvas.width / 2, 50);

  if (filters) {
    destinationCtx.fillStyle = "#B8B8B8";
    destinationCtx.textAlign = "center";
    destinationCtx.font = "16px Helvetica Neue";
    destinationCtx.fillText(
      `Applied filters: ${getFilters(filters)}`,
      canvas.width / 2,
      topPadding - 40
    );
    destinationCtx.fillText(
      getViolation(filters),
      canvas.width / 2,
      topPadding - 20
    );
  }
  destinationCtx.drawImage(canvas, 0, topPadding);

  return temporaryCanvas.toDataURL("image/png;base64");
}

function createMethodologyFile(
  chartId,
  chartTitle,
  timeWindowDescription,
  filters
) {
  const filename = "methodology.txt";
  const infoChart = translate("methodology")[chartId] || [];
  const exportDate = moment().format("M/D/YYYY");
  const filtersText = getFilters(filters);
  const violation = getViolation(filters);

  let text = `Chart: ${chartTitle}\r\n`;
  text += `Dates: ${timeWindowDescription}\r\n`;
  text += `Applied filters:\r\n`;
  text += `- ${filtersText}\r\n`;

  if (violation) {
    text += `- ${violation}\r\n`;
  }

  text += "\r\n";
  text += `Export Date: ${exportDate}\r\n\n`;

  infoChart.forEach((chart) => {
    text += `${chart.header}\r\n`;
    text += `${chart.body}\r\n`;
    text += "\r\n";
  });

  return {
    name: filename,
    data: text,
    type: "binary",
  };
}

function downloadZipFile(files, zipFilename) {
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
  zip.generateAsync({ type: "blob" }).then(function (content) {
    downloadjs(content, zipFilename);
  });
}

export async function transformChartDataToCsv(
  datasets,
  labels,
  convertValuesToNumbers,
  isTable
) {
  const datasetsWithoutTrendLine = datasets.filter(
    (dataset) => dataset.label !== "trendline"
  );

  let formattedData;

  if (!isTable && labels.length > datasetsWithoutTrendLine.length) {
    formattedData = labels.map((label, index) => {
      const dataPoints = datasetsWithoutTrendLine.reduce((acc, dataset) => {
        let dataPoint = dataset.data[index];

        if (convertValuesToNumbers && !Number.isNaN(Number(dataPoint))) {
          dataPoint = Number(dataPoint);
        }

        return { ...acc, [dataset.label]: dataPoint };
      }, {});

      return {
        dimension: label,
        ...dataPoints,
      };
    });
  } else {
    formattedData = datasetsWithoutTrendLine.map((dataset) => {
      return dataset.data.reduce(
        (acc, dataPoint, index) => ({
          ...acc,
          [labels[index]]: dataPoint,
        }),
        dataset.label ? { dimension: dataset.label } : {}
      );
    });
  }

  try {
    return await csvExport(formattedData, {
      mapHeaders: (header) => header.replace("dimension", ""),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    throw e;
  }
}

function configureDataDownloadButton({
  chartId,
  chartDatasets,
  chartLabels,
  filters,
  convertValuesToNumbers,
  chartTitle,
  timeWindowDescription,
  shouldZipDownload,
  isTable,
}) {
  return function downloadChartData() {
    const filename = configureFilename(chartId, filters, shouldZipDownload);
    const exportName = `${filename}.csv`;

    transformChartDataToCsv(
      chartDatasets,
      chartLabels,
      convertValuesToNumbers,
      isTable
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
        downloadjs(dataStr, exportName, "text/csv");
      }
    });
  };
}

function configureImageDownload({
  canvas,
  filename,
  chartTitle,
  filters,
  chartId,
  timeWindowDescription,
  shouldZipDownload,
}) {
  const imageData = transformCanvasToBase64(canvas, chartTitle, filters);

  if (shouldZipDownload) {
    const methodologyFile = createMethodologyFile(
      chartId,
      chartTitle,
      timeWindowDescription,
      filters
    );

    const imageFile = {
      name: filename,
      data: imageData.substring(22),
      type: "base64",
    };

    const files = [methodologyFile, imageFile];

    downloadZipFile(files, "export_image.zip");
  } else {
    downloadjs(imageData, filename, "image/png;base64");
  }
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
    configureImageDownload({
      canvas,
      filename: `${chartId}-${timeStamp()}.png`,
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
}) {
  const filename = configureFilename(chartId, filters, shouldZipDownload);
  const downloadChartAsImageButton = document.getElementById(
    `downloadChartAsImage-${chartId}`
  );

  if (downloadChartAsImageButton) {
    downloadChartAsImageButton.onclick = function downloadChartImage() {
      configureImageDownload({
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
  configureImageDownload({
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
  filters,
  timeWindowDescription,
  shouldZipDownload,
}) {
  const downloadChartData = configureDataDownloadButton({
    chartId,
    chartDatasets,
    chartLabels,
    filters,
    chartTitle,
    timeWindowDescription,
    shouldZipDownload,
  });
  downloadChartData();
}

export function downloadHtmlElementAsData({
  chartId,
  chartTitle,
  chartDatasets,
  chartLabels,
  filters,
  timeWindowDescription,
  shouldZipDownload,
  isTable,
}) {
  const downloadChartData = configureDataDownloadButton({
    chartId,
    chartDatasets,
    chartLabels,
    filters,
    chartTitle,
    timeWindowDescription,
    shouldZipDownload,
    isTable,
  });
  downloadChartData();
}
