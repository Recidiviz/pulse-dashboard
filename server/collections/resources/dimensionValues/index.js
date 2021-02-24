const { US_MO, US_PA } = require("../../../constants/stateCodes");
const { US_MO_DIMENSION_VALUES } = require("./us_mo");
const { US_PA_DIMENSION_VALUES } = require("./us_pa");

module.exports = {
  [US_MO]: US_MO_DIMENSION_VALUES,
  [US_PA]: US_PA_DIMENSION_VALUES,
};
