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
import csvExport from "jsonexport";

async function transformChartDataToCsv(
  datasets,
  labels,
  dataExportLabel,
  convertValuesToNumbers,
  fixLabelsInColumns = null
) {
  const datasetsWithoutTrendLine = datasets.filter(
    (dataset) => dataset.label !== "trendline"
  );

  let formattedData;

  if (!fixLabelsInColumns && labels.length >= datasetsWithoutTrendLine.length) {
    formattedData = labels.map((label, index) => {
      const dataPoints = datasetsWithoutTrendLine.reduce((acc, dataset) => {
        let dataPoint = dataset.data[index];

        if (convertValuesToNumbers && !Number.isNaN(Number(dataPoint))) {
          dataPoint = Number(dataPoint);
        }

        return { ...acc, [dataset.label]: dataPoint };
      }, {});

      return {
        [dataExportLabel]: label,
        ...dataPoints,
      };
    });
  } else {
    formattedData = datasetsWithoutTrendLine.map((dataset) => {
      return dataset.data.reduce(
        (acc, dataPoint, index) => ({
          ...acc,
          [labels[index]]: dataPoint,
        }),
        dataset.label ? { [dataExportLabel]: dataset.label } : {}
      );
    });
  }

  try {
    return await csvExport(formattedData, {
      headers: dataExportLabel ? [dataExportLabel] : [],
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export default transformChartDataToCsv;
