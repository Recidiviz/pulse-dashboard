import getOr from "lodash/fp/getOr";
import { calculateRate } from "../helpers/rate";

const getCounts = (transformedData, riskLevels, dimensions) => {
  const dataPoints = [];
  const numerators = [];
  const denominators = [];

  dimensions.forEach((dimension, i) => {
    dataPoints.push([]);
    numerators.push([]);
    denominators.push([]);

    riskLevels.forEach((riskLevel) => {
      const numerator = getOr(0, [dimension, riskLevel, 0], transformedData);
      const denominator = getOr(0, [dimension, riskLevel, 1], transformedData);
      const rate = calculateRate(numerator, denominator).toFixed(2);

      numerators[i].push(numerator);
      denominators[i].push(denominator);
      dataPoints[i].push(rate);
    });
  });

  return { dataPoints, numerators, denominators };
};

export default getCounts;
