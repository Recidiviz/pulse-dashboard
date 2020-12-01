import JSZip from "jszip";
import downloadjs from "downloadjs";

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

export default downloadZipFile;
