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
import downloadCanvasAsImage from "../../utils/downloads/downloadCanvasAsImage";
import configureFilename from "../../utils/downloads/configureFileName";

import {
  downloadHtmlElementAsImage,
  configureDataDownloadButton,
} from "../../utils/downloads/downloads";

export function configureDownloadButtons({
  chartId,
  chartTitle,
  chartDatasets,
  chartLabels,
  chartBox,
  filters,
  convertValuesToNumbers,
  timeWindowDescription,
  shouldZipDownload,
  fixLabelsInColumns = false,
  dataExportLabel = "Month",
  methodology,
}) {
  const filename = configureFilename(chartId, filters, shouldZipDownload);
  const downloadChartAsImageButton = document.getElementById(
    `downloadChartAsImage-${chartId}`
  );

  if (downloadChartAsImageButton) {
    downloadChartAsImageButton.onclick = function downloadChartImage() {
      downloadCanvasAsImage({
        canvas: chartBox || document.getElementById(chartId),
        filename: `${filename}.png`,
        chartTitle,
        filters,
        chartId,
        timeWindowDescription,
        shouldZipDownload,
      });
    };
  }

  const downloadChartDataButton = document.getElementById(
    `downloadChartData-${chartId}`
  );
  if (downloadChartDataButton) {
    downloadChartDataButton.onclick = configureDataDownloadButton({
      chartId,
      chartDatasets,
      chartLabels,
      filters,
      convertValuesToNumbers,
      chartTitle,
      timeWindowDescription,
      shouldZipDownload,
      dataExportLabel,
      fixLabelsInColumns,
      methodology,
    });
  }

  const downloadMapAsImageButton = document.getElementById(
    `downloadHtmlElementAsImage-${chartId}`
  );
  if (downloadMapAsImageButton) {
    downloadMapAsImageButton.onclick = function downloadMapImage() {
      downloadHtmlElementAsImage({
        chartId,
        chartTitle,
        filters,
        timeWindowDescription,
        shouldZipDownload,
      });
    };
  }
}
