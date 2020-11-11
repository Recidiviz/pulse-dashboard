// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import pattern from "patternomaly";
import pipe from "lodash/fp/pipe";
import filter from "lodash/fp/filter";
import groupBy from "lodash/fp/groupBy";
import values from "lodash/fp/values";
import map from "lodash/fp/map";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";
import orderBy from "lodash/fp/orderBy";
import { calculateRate } from "../helpers/rate";

import { translate } from "../../../../views/tenants/utils/i18nSettings";
import { isDenominatorStatisticallySignificant } from "../../../../utils/charts/significantStatistics";
import { sumCounts } from "../utils/sumCounts";
import getNameFromOfficerId from "../utils/getNameFromOfficerId";
import { COLORS } from "../../../../assets/scripts/constants/colors";
import { filterOptimizedDataFormat } from "../../../../utils/charts/dataFilters";

const generatePercentChartData = (apiData, currentDistricts, mode) => {
  const [fieldName, totalFieldName] =
    mode === "exits"
      ? ["exit_count", "total_exit_count"]
      : ["supervision_count", "total_supervision_count"];

  const filteredData = pipe(
    filter((item) => item.district !== "ALL"),
    groupBy("officer"),
    values,
    map((dataset) => ({
      officer: `${dataset[0].district}-${getNameFromOfficerId(
        dataset[0].officer
      )}`,
      count: sumBy((item) => toInteger(item.population_count), dataset),
      [fieldName]: sumBy((item) => toInteger(item[totalFieldName]), dataset),
    })),
    map((dataPoint) => ({
      officer: dataPoint.officer,
      count: dataPoint.count,
      [fieldName]: dataPoint[fieldName],
      rate: calculateRate(dataPoint.count, dataPoint[fieldName]),
    })),
    orderBy(["rate"], ["desc"])
  )(apiData);

  const dataPoints = map((item) => item.rate.toFixed(2), filteredData);

  const labels = map("officer", filteredData);
  const denominators = map("supervision_count", filteredData);
  const numerators = map("count", filteredData);

  const getBarBackgroundColor = ({ dataIndex }) => {
    let color = COLORS["lantern-orange"];

    if (!isDenominatorStatisticallySignificant(denominators[dataIndex])) {
      color = pattern.draw("diagonal-right-left", color, "#ffffff", 5);
    }

    return color;
  };

  const datasets = [
    {
      label: translate("percentOfPopulationRevoked"),
      backgroundColor: getBarBackgroundColor,
      data: dataPoints,
    },
  ];

  const data = {
    labels,
    datasets,
  };

  const averageRate = calculateRate(
    sumCounts("population_count", apiData),
    sumCounts("total_supervision_count", apiData)
  );

  return { data, numerators, denominators, averageRate };
};

const generateCountChartData = (apiData) => {
  const transformedData = pipe(
    filter((item) => item.district !== "ALL"),
    groupBy("officer"),
    values,
    map((dataset) => ({
      officer: `${dataset[0].district}-${getNameFromOfficerId(
        dataset[0].officer
      )}`,
      count: sumBy((item) => toInteger(item.population_count), dataset),
    })),
    orderBy(["count"], ["desc"])
  )(apiData);

  const labels = map("officer", transformedData);
  const dataPoints = transformedData.map((item) => item.count);

  const datasets = [
    {
      label: translate("Revocations"),
      backgroundColor: COLORS["lantern-orange"],
      data: dataPoints,
    },
  ];

  return { data: { datasets, labels }, denominators: [] };
};

const createGenerateChartData = (dataFilter, currentDistricts) => (
  apiData,
  mode,
  unflattenedValues
) => {
  const filteredData = filterOptimizedDataFormat(
    unflattenedValues,
    apiData,
    apiData.metadata,
    dataFilter
  );
  switch (mode) {
    case "counts":
      return generateCountChartData(filteredData);
    case "exits":
    case "rates":
    default:
      return generatePercentChartData(filteredData, currentDistricts, mode);
  }
};

export default createGenerateChartData;
