const { default: NewRevocationsMetrics } = require("./NewRevocationsMetrics");
const { default: BaseMetrics } = require("./BaseMetrics");
const { METRIC_TYPES } = require("./metrics/shared");

function getMetricsByType(metricType, stateCode) {
  switch (metricType) {
    case METRIC_TYPES.NEW_REVOCATION:
      return new NewRevocationsMetrics(metricType, stateCode);
    case METRIC_TYPES.COMMUNITY_GOALS:
    case METRIC_TYPES.COMMUNITY_EXPLORE:
    case METRIC_TYPES.FACILITIES_GOALS:
    case METRIC_TYPES.FACILITIES_EXPLORE:
    case METRIC_TYPES.PROGRAMMING_EXPLORE:
      return new BaseMetrics(metricType, stateCode);
    default:
      throw new Error(`No such metric type ${metricType}`);
  }
}

exports.default = getMetricsByType;
