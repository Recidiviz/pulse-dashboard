const { US_MO, US_PA } = require("../../../constants/stateCodes");
const { US_MO_DIMENSIONS } = require("./us_mo");
const { US_PA_DIMENSIONS } = require("./us_pa");

module.exports = {
  [US_MO]: US_MO_DIMENSIONS,
  [US_PA]: US_PA_DIMENSIONS,
};
