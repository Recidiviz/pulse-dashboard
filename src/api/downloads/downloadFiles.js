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
import JSZip from "jszip";
import JsFileDownloader from "js-file-downloader";
import exportDataClient from "./exportDataClient";

function downloadMsBlob(csv, exportName) {
  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });
  navigator.msSaveBlob(blob, exportName);
}

function downloadEncodedCSV(csv, exportName) {
  const encodedCsv = encodeURIComponent(csv);
  const dataStr = `data:text/csv;charset=utf-8,${encodedCsv}`;
  const jsFileDownload = new JsFileDownloader({
    autoStart: false,
    url: dataStr,
    filename: exportName,
  });
  jsFileDownload.start();
}

function downloadImage(filename, imageData) {
  const jsFileDownload = new JsFileDownloader({
    autoStart: false,
    filename,
    url: imageData,
  });
  jsFileDownload.start();
}

async function downloadZipFile(files, filename, getTokenSilently) {
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
  const OSinfo = navigator.userAgent;
  if (
    (OSinfo.includes("iPhone") || OSinfo.includes("iPad")) &&
    !OSinfo.includes("CriOS")
  ) {
    zip.generateAsync({ type: "base64" }).then((content) => {
      const jsFileDownload = new JsFileDownloader({
        forceDesktopMode: true,
        autoStart: false,
        filename,
        url: `data:application/zip;base64,${content}`,
      });
      jsFileDownload.start();
    });
  } else {
    const content = await zip.generateAsync({ type: "blob" });
    const formData = new FormData();
    formData.append("zip", content, filename);
    await exportDataClient(formData, filename, getTokenSilently);
  }
}

export { downloadMsBlob, downloadZipFile, downloadEncodedCSV, downloadImage };
