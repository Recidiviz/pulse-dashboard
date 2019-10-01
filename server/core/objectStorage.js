// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

/**
 * Utilities for retrieving data from Google Cloud Storage.
 *
 * Assuming the bucket or file you want to access is authenticated, this relies on appropriate
 * auth configuration in environment variables as described in the README.
 */

const { Storage } = require('@google-cloud/storage');

/**
 * Asynchronously downloads the file in the given bucket with the given file name.
 * Returns a Promise which will eventually return either an error or the contents of the file as a
 * Buffer of bytes.
 */
function downloadFile(bucketName, stateCode, srcFilename) {
  const storage = new Storage();

  // Returns a Promise that returns a Buffer with the file bytes once the download completes
  return storage
    .bucket(bucketName)
    .file(`${stateCode}/${srcFilename}`)
    .download();
}

module.exports = {
  downloadFile,
};
