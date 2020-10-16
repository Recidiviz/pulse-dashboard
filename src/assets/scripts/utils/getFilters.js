import pipe from "lodash/fp/pipe";
import find from "lodash/fp/find";
import get from "lodash/fp/get";
import { humanReadableTitleCase } from "../../../utils/transforms/labels";
import { SUPERVISION_LEVELS } from "../../../views/tenants/constants/filterOptions";

function formatMetricPeriodMonthsFilter(metricPeriodMonths) {
  switch (metricPeriodMonths) {
    case "1":
      return "1 month";
    case "3":
      return "3 months";
    case "6":
      return "6 months";
    case "12":
      return "1 year";
    case "36":
      return "3 years";
    default:
      return "1 month";
  }
}

const formatDistrict = (district) =>
  district === "All" ? "All districts" : `District: ${district}`;

const formatChargeCategory = (chargeCategory) =>
  chargeCategory === "All"
    ? "All case types"
    : `Case type: ${humanReadableTitleCase(chargeCategory)}`;

const formatSupervisionType = (supervisionType) =>
  supervisionType === "All"
    ? "All supervision types"
    : `Supervision type: ${humanReadableTitleCase(supervisionType)}`;

const formatSupervisionLevel = (supervisionLevel) =>
  supervisionLevel === "All"
    ? "All supervision levels"
    : `Supervision level: ${pipe(
        find({ value: supervisionLevel }),
        get("label")
      )(SUPERVISION_LEVELS.options)}`;

function getFilters(toggleStates) {
  const filters = [];

  if (toggleStates.metricPeriodMonths) {
    filters.push(
      formatMetricPeriodMonthsFilter(toggleStates.metricPeriodMonths)
    );
  }

  if (toggleStates.district) {
    filters.push(formatDistrict(toggleStates.district));
  }

  if (toggleStates.chargeCategory) {
    filters.push(formatChargeCategory(toggleStates.chargeCategory));
  }

  if (toggleStates.supervisionType) {
    filters.push(formatSupervisionType(toggleStates.supervisionType));
  }

  if (toggleStates.supervisionLevel) {
    filters.push(formatSupervisionLevel(toggleStates.supervisionLevel));
  }

  return filters.join(", ");
}

export default getFilters;
