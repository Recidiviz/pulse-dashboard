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
import { COLORS } from "../../../../assets/scripts/constants/colors";
import { sumCounts } from "./helpers";

const generatePercentChartData = (apiData, currentDistricts, mode) => {
  const [fieldName, totalFieldName] =
    mode === "exits"
      ? ["exit_count", "total_exit_count"]
      : ["supervision_count", "total_supervision_count"];

  const filteredData = pipe(
    filter((item) => item.district !== "ALL"),
    groupBy("district"),
    values,
    map((dataset) => ({
      district: dataset[0].district,
      count: sumBy((item) => toInteger(item.population_count), dataset),
      [fieldName]: sumBy((item) => toInteger(item[totalFieldName]), dataset),
    })),
    map((dataPoint) => ({
      district: dataPoint.district,
      count: dataPoint.count,
      [fieldName]: dataPoint[fieldName],
      rate: calculateRate(dataPoint.count, dataPoint[fieldName]),
    })),
    orderBy(["rate"], ["desc"])
  )(apiData);

  const dataPoints = map((item) => item.rate.toFixed(2), filteredData);

  const labels = map("district", filteredData);
  const denominators = map("supervision_count", filteredData);
  const numerators = map("count", filteredData);

  const getBarBackgroundColor = ({ dataIndex }) => {
    let color =
      currentDistricts &&
      currentDistricts.find(
        (currentDistrict) =>
          currentDistrict.toLowerCase() === labels[dataIndex].toLowerCase()
      )
        ? COLORS["lantern-light-blue"]
        : COLORS["lantern-orange"];

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

const generateCountChartData = (apiData, currentDistricts) => {
  const transformedData = pipe(
    filter((item) => item.district !== "ALL"),
    groupBy("district"),
    values,
    map((dataset) => ({
      district: dataset[0].district,
      count: sumBy((item) => toInteger(item.population_count), dataset),
    })),
    orderBy(["count"], ["desc"])
  )(apiData);

  const labels = map("district", transformedData);
  const dataPoints = transformedData.map((item) => item.count);
  const getBarBackgroundColor = ({ dataIndex }) =>
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

const createGenerateChartData = (dataFilter, currentDistricts) => (
  apiData,
  mode
) => {
  const filteredData = dataFilter(apiData);
  switch (mode) {
    case "counts":
      return generateCountChartData(filteredData, currentDistricts);
    case "exits":
    case "rates":
    default:
      return generatePercentChartData(filteredData, currentDistricts, mode);
  }
};

export default createGenerateChartData;
