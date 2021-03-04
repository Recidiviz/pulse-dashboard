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

import pipe from "lodash/fp/pipe";
import groupBy from "lodash/fp/groupBy";
import values from "lodash/fp/values";
import filter from "lodash/fp/filter";
import map from "lodash/fp/map";
import sumBy from "lodash/fp/sumBy";
import toInteger from "lodash/fp/toInteger";
import orderBy from "lodash/fp/orderBy";
import { calculateRate } from "../helpers/rate";

import { translate } from "../../../../utils/i18nSettings";
import { applyStatisticallySignificantShading } from "../../../../utils/charts/significantStatistics";
import { COLORS } from "../../../../assets/scripts/constants/colors";
import { sumCounts } from "../utils/sumCounts";

const generatePercentChartData = (
  districtChartData,
  currentDistricts,
  mode
) => {
  const [fieldName, totalFieldName] =
    mode === "exits"
      ? ["exit_count", "exit_count"]
      : ["supervision_count", "supervision_population_count"];
  const transformedData = pipe(
    filter((item) => item.district !== "ALL"),
    groupBy("district"),
    values,
    map((dataset) => ({
      district: dataset[0].district,
      count: sumBy((item) => toInteger(item.revocation_count), dataset),
      [fieldName]: sumBy((item) => toInteger(item[totalFieldName]), dataset),
    })),
    map((dataPoint) => ({
      district: dataPoint.district,
      count: dataPoint.count,
      [fieldName]: dataPoint[fieldName],
      rate: calculateRate(dataPoint.count, dataPoint[fieldName]),
    })),
    orderBy(["rate"], ["desc"])
  )(districtChartData);
  const dataPoints = map((item) => item.rate.toFixed(2), transformedData);

  const labels = map("district", transformedData);
  const denominators = map("supervision_count", transformedData);
  const numerators = map("count", transformedData);

  const getBarBackgroundColor = ({ dataIndex }) => {
    const color =
      currentDistricts &&
      labels[dataIndex] &&
      currentDistricts.find(
        (currentDistrict) =>
          currentDistrict.toLowerCase() === labels[dataIndex].toLowerCase()
      )
        ? COLORS["lantern-light-blue"]
        : COLORS["lantern-orange"];
    return applyStatisticallySignificantShading(color, denominators[dataIndex]);
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
    sumCounts("revocation_count", districtChartData),
    sumCounts("supervision_population_count", districtChartData)
  );

  return { data, numerators, denominators, averageRate };
};

const generateCountChartData = (districtChartData, currentDistricts) => {
  const transformedData = pipe(
    filter((item) => item.district !== "ALL"),
    groupBy("district"),
    values,
    map((dataset) => ({
      district: dataset[0].district,
      count: sumBy((item) => toInteger(item.revocation_count), dataset),
    })),
    orderBy(["count"], ["desc"])
  )(districtChartData);

  const labels = map("district", transformedData);
  const dataPoints = transformedData.map((item) => item.count);
  const getBarBackgroundColor = ({ dataIndex }) =>
    currentDistricts &&
    labels[dataIndex] &&
    currentDistricts.find(
      (currentDistrict) =>
        currentDistrict.toLowerCase() === labels[dataIndex].toLowerCase()
    )
      ? COLORS["lantern-light-blue"]
      : COLORS["lantern-orange"];

  const datasets = [
    {
      label: translate("Revocations"),
      backgroundColor: getBarBackgroundColor,
      data: dataPoints,
    },
  ];
  return { data: { datasets, labels }, denominators: [] };
};

const createGenerateChartData = (districtChartData, currentDistricts) => (
  mode
) => {
  switch (mode) {
    case "counts":
      return generateCountChartData(districtChartData, currentDistricts);
    case "exits":
    case "rates":
    default:
      return generatePercentChartData(
        districtChartData,
        currentDistricts,
        mode
      );
  }
};

export default createGenerateChartData;
