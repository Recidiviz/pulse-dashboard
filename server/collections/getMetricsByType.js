const { default: NewRevocationsMetrics } = require("./NewRevocationsMetrics");
const { default: BaseMetrics } = require("./BaseMetrics");
const { COLLECTIONS } = require("./resources");

function getMetricsByType(metricType, stateCode) {
  switch (metricType) {
    case COLLECTIONS.NEW_REVOCATION:
      return new NewRevocationsMetrics(metricType, stateCode);
    case COLLECTIONS.COMMUNITY_GOALS:
    case COLLECTIONS.COMMUNITY_EXPLORE:
    case COLLECTIONS.FACILITIES_GOALS:
    case COLLECTIONS.FACILITIES_EXPLORE:
    case COLLECTIONS.PROGRAMMING_EXPLORE:
      return new BaseMetrics(metricType, stateCode);
    default:
      throw new Error(`No such metric type ${metricType} for ${stateCode}`);
  }
}

exports.default = getMetricsByType;
