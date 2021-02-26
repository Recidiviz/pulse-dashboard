const { default: getCollections } = require("./getCollections");
const { US_MO, US_PA, US_ND } = require("../../constants/stateCodes");

exports.default = {
  US_MO: getCollections(US_MO),
  US_PA: getCollections(US_PA),
  US_DEMO: getCollections(US_PA),
  US_ND: getCollections(US_ND),
};
