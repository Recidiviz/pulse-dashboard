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
import JsFileDownloader from "js-file-downloader";
import * as Sentry from "@sentry/react";

export default async function exportDataClient(
  formData,
  filename,
  getTokenSilently
) {
  const token = await getTokenSilently();

  return fetch(`${process.env.REACT_APP_API_URL}/api/generateFileLink`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.text())
    .then((url) => {
      // This file downloader should not be used for mobile Safari.
      // The download for mobile Safari is handled in downloadZipFile.
      const jsFileDownload = new JsFileDownloader({
        autoStart: false,
        filename,
        url,
      });
      jsFileDownload.start();
    })
    .catch((error) => {
      console.error(error);
      Sentry.captureException(error, (scope) => {
        scope.setContext("exportDataClient", {
          filename,
        });
      });
    });
}
