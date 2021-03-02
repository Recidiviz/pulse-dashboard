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
import JsFileDownloader from "js-file-downloader";
import exportDataClient from "./exportDataClient";
import transformCanvasToBase64 from "./transformCanvasToBase64";
import createMethodologyFile from "../../utils/downloads/createMethodologyFile";

// Functions for flowing through browser-specific download functionality
// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
const isIE = /* @cc_on!@ */ false || !!document.documentMode;
const isEdge = !isIE && !!window.StyleMedia;
const isMobileSafari =
  (navigator.userAgent.includes("iPhone") ||
    navigator.userAgent.includes("iPad")) &&
  !navigator.userAgent.includes("CriOS");

function downloadMsBlob(csv, exportName) {
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });
  navigator.msSaveBlob(blob, exportName);
}

function downloadEncodedCSV(csv, filename) {
  const encodedCsv = encodeURIComponent(csv);
  const dataStr = `data:text/csv;charset=utf-8,${encodedCsv}`;
  const downloader = new JsFileDownloader({
    autoStart: false,
    filename,
    url: dataStr,
  });
  downloader.start();
}

function downloadImage(filename, imageData) {
  const jsFileDownload = new JsFileDownloader({
    autoStart: false,
    filename,
    url: imageData,
  });
  jsFileDownload.start();
}

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

  // iOS mobile Safari needs forceDesktopMode=true to correctly
  // download the file.
  if (isMobileSafari) {
    zip.generateAsync({ type: "base64" }).then((content) => {
      const jsFileDownload = new JsFileDownloader({
        forceDesktopMode: true,
        autoStart: false,
        filename,
        url: `data:application/zip;base64,${content}`,
      });
      jsFileDownload.start();
    });
  } else if (isIE || isEdge) {
    zip.generateAsync({ type: "blob" }).then(function (content) {
      downloadjs(content, filename);
    });
  } else {
    const content = await zip.generateAsync({ type: "blob" });
    const formData = new FormData();
    formData.append("zip", content, filename);
    await exportDataClient(formData, filename, getTokenSilently);
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
    } else if (isIE || isEdge) {
      downloadjs(imageData, filename, "image/png;base64");
    } else {
      downloadImage(filename, imageData);
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
      downloadMsBlob(csv, filename);
    } else {
      downloadEncodedCSV(csv, filename);
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
