import map from "lodash/fp/map";
import pipe from "lodash/fp/pipe";
import pick from "lodash/fp/pick";
import concat from "lodash/fp/concat";
import mergeAllWith from "lodash/fp/mergeAllWith";
import toInteger from "lodash/fp/toInteger";

import { calculateRate } from "../helpers/rate";
import { COLORS } from "../../../../assets/scripts/constants/colors";

const generateRevocationsByViolationChartData = (
  apiData,
  dataFilter,
  violationTypes
) => {
  const violationCountKey = "violation_count";

  const allViolationTypeKeys = map("key", violationTypes);

  const violationToCount = pipe(
    dataFilter,
    map(pick(concat(allViolationTypeKeys, violationCountKey))),
    mergeAllWith((a, b) => toInteger(a) + toInteger(b))
  )(apiData);

  const totalViolationCount = toInteger(violationToCount[violationCountKey]);
  const numerators = map(
    (type) => violationToCount[type],
    allViolationTypeKeys
  );
  const denominators = map(() => totalViolationCount, allViolationTypeKeys);
  const chartDataPoints = map(
    (type) =>
      calculateRate(violationToCount[type], totalViolationCount).toFixed(2),
    allViolationTypeKeys
  );

  // This sets bar color to light-blue-500 when it's a technical violation, orange when it's law
  const colorTechnicalAndLaw = violationTypes.map((violationType) => {
    switch (violationType.type) {
      case "TECHNICAL":
        return COLORS["lantern-light-blue"];
      case "LAW":
        return COLORS["lantern-orange"];
      default:
        return COLORS["lantern-light-blue"];
    }
  });

  return {
    data: {
      labels: map("label", violationTypes),
      datasets: [
        {
          label: "Proportion of violations",
          backgroundColor: colorTechnicalAndLaw,
          hoverBackgroundColor: colorTechnicalAndLaw,
          hoverBorderColor: colorTechnicalAndLaw,
          data: chartDataPoints,
        },
      ],
    },
    numerators,
    denominators,
  };
};

export default generateRevocationsByViolationChartData;
