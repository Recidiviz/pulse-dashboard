import JSZip from "jszip";
import JsFileDownloader from "js-file-downloader";
import exportDataClient from "../../api/downloads/exportDataClient";

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

export default downloadZipFile;
