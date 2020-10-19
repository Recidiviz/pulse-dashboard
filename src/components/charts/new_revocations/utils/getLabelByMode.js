import { translate } from "../../../../views/tenants/utils/i18nSettings";

const getLabelByMode = (mode) => {
  switch (mode) {
    case "rates":
    default:
      return translate("percentOfPopulationRevoked");
    case "exits":
      return "Percent revoked out of all exits";
  }
};

export default getLabelByMode;
