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
function downloadFile(bucketName, srcFilename) {
  const storage = new Storage();

  // Returns a Promise that returns a Buffer with the file bytes once the download completes
  return storage
    .bucket(bucketName)
    .file(srcFilename)
    .download();
}

module.exports = {
  downloadFile: downloadFile
}
