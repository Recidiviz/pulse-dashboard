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

function transformCanvasToBase64(canvas, chartTitle, filters, violation) {
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
      `Applied filters: ${filters}`,
      canvas.width / 2,
      topPadding - 40
    );
    if (violation) {
      destinationCtx.fillText(
        `${violation}`,
        canvas.width / 2,
        topPadding - 20
      );
    }
  }
  destinationCtx.drawImage(canvas, 0, topPadding);

  return temporaryCanvas.toDataURL("image/png;base64");
}

export default transformCanvasToBase64;
