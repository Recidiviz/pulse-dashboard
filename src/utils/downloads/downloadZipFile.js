import JSZip from "jszip";
import JsFileDownloader from "js-file-downloader";

function downloadZipFile(files, filename) {
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

  zip.generateAsync({ type: "blob" }).then((content) => {
    const formData = new FormData();
    formData.append("zip", content, filename);
    fetch(`${process.env.REACT_APP_API_URL}/api/generateFileLink`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((url) => {
        new JsFileDownloader({
          url,
          filename,
        });
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.log(`error.message ⏩ :`, error.message);
      });
  });
}

export default downloadZipFile;
