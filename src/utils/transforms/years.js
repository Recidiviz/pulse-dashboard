import moment from "moment";

function getYearFromNow(yearDifference = 0) {
  return moment().add(yearDifference, "years").format("YYYY");
}

export {
  getYearFromNow,
};