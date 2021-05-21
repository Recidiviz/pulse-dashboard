const { default: NewRevocationsMetrics } = require("./NewRevocationsMetrics");
const { default: BaseMetrics } = require("./BaseMetrics");
const { COLLECTIONS } = require("../constants/collections");

function getMetricsByType(metricType, stateCode) {
  switch (metricType) {
    case COLLECTIONS.NEW_REVOCATION:
      return new NewRevocationsMetrics(metricType, stateCode);
    case COLLECTIONS.GOALS:
    case COLLECTIONS.COMMUNITY_EXPLORE:
    case COLLECTIONS.FACILITIES_EXPLORE:
    case COLLECTIONS.POPULATION_PROJECTIONS:
    case COLLECTIONS.VITALS:
      return new BaseMetrics(metricType, stateCode);
    default:
      throw new Error(`No such metric type ${metricType} for ${stateCode}`);
  }
}

exports.default = getMetricsByType;
