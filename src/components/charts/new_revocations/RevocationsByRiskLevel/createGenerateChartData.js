import pipe from "lodash/fp/pipe";
import filter from "lodash/fp/filter";
import groupBy from "lodash/fp/groupBy";
import values from "lodash/fp/values";
import sortBy from "lodash/fp/sortBy";
import map from "lodash/fp/map";
import pattern from "patternomaly";
import { humanReadableTitleCase } from "../../../../utils/transforms/labels";
import { sumIntBy } from "../helpers/counts";
import { calculateRate } from "../helpers/rate";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import { COLORS } from "../../../../assets/scripts/constants/colors";
import { isDenominatorStatisticallySignificant } from "../../../../utils/charts/significantStatistics";
import getDenominatorKeyByMode from "../utils/getDenominatorKeyByMode";
import getLabelByMode from "../utils/getLabelByMode";

const createGenerateChartData = (dataFilter) => (apiData, mode) => {
  const denominatorKey = getDenominatorKeyByMode(mode);
  const riskLevels = translate("riskLevelsMap");

  const riskLevelCounts = pipe(
    dataFilter,
    filter((data) => Object.keys(riskLevels).includes(data.risk_level)),
    groupBy("risk_level"),
    values,
    sortBy((dataset) => Object.keys(riskLevels).indexOf(dataset[0].risk_level)),
    map((dataset) => {
      const riskLevelLabel = riskLevels[dataset[0].risk_level];
      const label = humanReadableTitleCase(riskLevelLabel);
      const numerator = sumIntBy("population_count", dataset);
      const denominator = sumIntBy(denominatorKey, dataset);
      const rate = calculateRate(numerator, denominator);
      return {
        label,
        numerator,
        denominator,
        rate: rate.toFixed(2),
      };
    })
  )(apiData);

  const chartDataPoints = map("rate", riskLevelCounts);
  const numerators = map("numerator", riskLevelCounts);
  const denominators = map("denominator", riskLevelCounts);

  const barBackgroundColor = ({ dataIndex }) => {
    const color = COLORS["lantern-orange"];
    if (isDenominatorStatisticallySignificant(denominators[dataIndex])) {
      return color;
    }
    return pattern.draw("diagonal-right-left", color, "#ffffff", 5);
  };

  const data = {
    labels: map("label", riskLevelCounts),
    datasets: [
      {
        label: getLabelByMode(mode),
        backgroundColor: barBackgroundColor,
        data: chartDataPoints,
      },
    ],
  };

  return { data, numerators, denominators };
};

export default createGenerateChartData;
