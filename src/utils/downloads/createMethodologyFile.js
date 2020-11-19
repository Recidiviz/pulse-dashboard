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
  const filename = "methodology.txt";
  const infoChart = translate("methodology")[chartId] || [];
  const exportDate = moment().format("M/D/YYYY");
  const filtersText = getFilters(filters);
  const violation = getViolation(filters);

  let text = `Chart: ${chartTitle}\r\n`;
  text += `Dates: ${timeWindowDescription}\r\n`;
  text += `Applied filters:\r\n`;
  text += `- ${filtersText}\r\n`;

  if (violation) {
    text += `- ${violation}\r\n`;
  }

  text += "\r\n";
  text += `Export Date: ${exportDate}\r\n\n`;

  infoChart.forEach((chart) => {
    text += `${chart.header}\r\n`;
    text += `${chart.body}\r\n`;
    text += "\r\n";
  });

  return {
    name: filename,
    data: text,
    type: "binary",
  };
}

export default createMethodologyFile;
