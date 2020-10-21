import pipe from "lodash/fp/pipe";
import set from "lodash/fp/set";
import getOr from "lodash/fp/getOr";
import toInteger from "lodash/fp/toInteger";

/**
 * Transform to
 * {
 *   ASIAN: { LOW: [1, 4], HIGH: [5, 9], ... } }
 *   HISPANIC: { LOW: [2, 9], HIGH: [2, 8], ... } }
 * }
 */
const createRiskLevelsMap = (numeratorKey, denominatorKey, field) => (
  acc,
  data
) => {
  return pipe(
    set(
      [data[field], data.risk_level],
      [
        getOr(0, [data[field], data.risk_level, 0], acc) +
          toInteger(data[numeratorKey]),
        getOr(0, [data[field], data.risk_level, 1], acc) +
          toInteger(data[denominatorKey]),
      ]
    ),
    set(
      [data[field], "OVERALL"],
      [
        getOr(0, [data[field], "OVERALL", 0], acc) +
          toInteger(data[numeratorKey]),
        getOr(0, [data[field], "OVERALL", 1], acc) +
          toInteger(data[denominatorKey]),
      ]
    )
  )(acc);
};

export default createRiskLevelsMap;
