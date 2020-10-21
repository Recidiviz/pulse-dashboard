import { translate } from "../../../../views/tenants/utils/i18nSettings";

const getLabelByMode = (mode) => {
  switch (mode) {
    case "counts":
      return `${translate("Revocation")} count`;
    case "exits":
      return "Percent revoked out of all exits";
    case "rates":
    default:
      return translate("percentOfPopulationRevoked");
  }
};

export default getLabelByMode;
