import moment from "moment";
import { translate } from "../../views/tenants/utils/i18nSettings";
import getFilters from "./getFilters";
import getViolation from "./getViolation";

function createMethodologyFile(
  chartId,
  chartTitle,
  timeWindowDescription,
  filters
) {
  const infoChart = translate("methodology")[chartId] || [];
  const exportDate = moment().format("M/D/YYYY");
  const filtersText = getFilters(filters);
  const violation = getViolation(filters);

  let text = `Chart: ${chartTitle}\n`;
  text += `Dates: ${timeWindowDescription}\n`;
  text += `Applied filters:\n`;
  text += `- ${filtersText}\n`;

  if (violation) {
    text += `- ${violation}\n`;
  }

  text += "\n";
  text += `Export Date: ${exportDate}\n\n`;

  infoChart.forEach((chart) => {
    text += `${chart.header}\n`;
    text += `${chart.body}\n`;
    text += "\n";
  });

  return {
    name: "methodology.txt",
    data: text,
    type: "binary",
  };
}

export default createMethodologyFile;
