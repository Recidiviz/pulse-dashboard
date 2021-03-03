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
import exportZipDataOnMobileDevices from "../../api/exportData/exportZipDataOnMobileDevices";
import transformCanvasToBase64 from "./transformCanvasToBase64";
import createMethodologyFile from "./createMethodologyFile";
// Functions for flowing through browser-specific download functionality
// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
const isIE = /* @cc_on!@ */ false || !!document.documentMode;
const isEdge = !isIE && !!window.StyleMedia;

const isMobile = navigator.userAgent.includes("Mobile");

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
    await exportZipDataOnMobileDevices(formData, filename, getTokenSilently);
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
  chartId,
  timeWindowDescription,
  shouldZipDownload,
  methodology,
  getTokenSilently,
}) {
  const imageData = transformCanvasToBase64(canvas, chartTitle, filters);
  try {
    if (shouldZipDownload) {
      const methodologyFile = createMethodologyFile(
        chartId,
        chartTitle,
        timeWindowDescription,
        filters,
        methodology
      );

      const imageFile = {
        name: filename,
        data: imageData.substring(22),
        type: "base64",
      };

      const files = [methodologyFile, imageFile];

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
  csv,
  chartId,
  filename,
  getTokenSilently,
  methodologyFile = null,
}) {
  try {
    if (shouldZipDownload) {
      const files = [
        methodologyFile,
        {
          name: filename,
          data: csv,
          type: "binary",
        },
      ];

      downloadZipFile({
        files,
        filename: "export_data.zip",
        getTokenSilently,
      });
    } else if (isIE || isEdge) {
      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });
      navigator.msSaveBlob(blob, filename);
    } else {
      const encodedCsv = encodeURIComponent(csv);
      const dataStr = `data:text/csv;charset=utf-8,${encodedCsv}`;
      downloadjs(dataStr, filename, "text/csv");
    }
  } catch (error) {
    console.error(error);
    Sentry.captureException(error, (scope) => {
      scope.setContext("downloadData", {
        chartId,
        filename,
        shouldZipDownload,
      });
    });
  }
}
