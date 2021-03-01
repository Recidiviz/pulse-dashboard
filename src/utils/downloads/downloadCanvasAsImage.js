import createMethodologyFile from "./createMethodologyFile";
import {
  downloadZipFile,
  downloadImage,
} from "../../api/downloads/downloadFiles";
import getFilters from "./getFilters";
import getViolation from "./getViolation";

function transformCanvasToBase64(canvas, chartTitle, filters) {
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

function downloadCanvasAsImage({
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

    downloadZipFile(files, "export_image.zip", getTokenSilently);
  } else {
    downloadImage(filename, imageData);
  }
}

export default downloadCanvasAsImage;
