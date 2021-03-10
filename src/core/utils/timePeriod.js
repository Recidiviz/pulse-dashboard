import moment from "moment";
import { monthNamesWithYears } from "../../utils/months";

export function getYearFromNow(yearDifference = 0) {
  return moment().add(yearDifference, "years").format("YYYY");
}

export const monthNamesWithYearsFromNumbers = function monthNamesShortWithYearsFromNumbers(
  monthNumbers,
  abbreviated
) {
  return monthNamesWithYears(monthNumbers, abbreviated, false);
};

export default {
  getYearFromNow,
};
