import moment from "moment";

export function getYearFromNow(yearDifference = 0) {
  return moment().add(yearDifference, "years").format("YYYY");
}

export default {
  getYearFromNow,
};
