// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================
import numeral from "numeral";
import lowerCase from "lodash/fp/lowerCase";
import pipe from "lodash/fp/pipe";
import startCase from "lodash/fp/startCase";
import moment from "moment";
import { toNumber } from "./index";
import { translate } from "./i18nSettings";

function getStatePopulations() {
  return Object.keys(translate("populationChartAttributes"));
}

function getStatePopulationsLabels() {
  return Object.values(translate("populationChartAttributes"));
}

const genderValueToLabel = {
  MALE: "Male",
  FEMALE: "Female",
};

const raceValueToLabel = {
  AMERICAN_INDIAN_ALASKAN_NATIVE: "American Indian Alaskan Native",
  ASIAN: "Asian",
  BLACK: "Black",
  HISPANIC: "Hispanic",
  NATIVE_HAWAIIAN_PACIFIC_ISLANDER: "Native Hawaiian Pacific Islander",
  WHITE: "White",
  OTHER: "Other",
  EXTERNAL_UNKNOWN: "Unknown",
};

const matrixViolationTypeToLabel = {
  TECHNICAL: "Technical",
  SUBSTANCE_ABUSE: "Subs. use",
  MUNICIPAL: "Municipal",
  ABSCONDED: "Absconsion",
  MISDEMEANOR: "Misdemeanor",
  FELONY: "Felony",
  LOW_TECH: "Low tech.",
  MED_TECH: "Med tech.",
  ELEC_MONITORING: "Elec. monitoring",
  SUBS_USE: "Subs. use",
  ABSCONDING: "Absconding",
  HIGH_TECH: "High tech.",
  SUMMARY_OFFENSE: "Summary offense",
  LAW: "Law",
};

function genderValueToHumanReadable(genderValue) {
  return genderValueToLabel[genderValue];
}

function raceValueToHumanReadable(raceValue) {
  return raceValueToLabel[raceValue];
}

function toHtmlFriendly(string) {
  return string.replace(/\W+/g, "-");
}

function toHumanReadable(string) {
  return string.replace(/[-_]/g, " ");
}

function toInt(nonInt) {
  return parseInt(nonInt, 10);
}

function toTitleCase(str) {
  return (
    str &&
    str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  );
}

const humanReadableTitleCase = pipe(lowerCase, startCase);

/*
 * Returns the officer id from the canonical id format, '123: Firstname Lastname'.
 */
function numberFromOfficerId(officerId) {
  // This works even for the described format, correctly parsing out 123
  return toInt(officerId);
}

const violationCountLabel = (count) => (count === "8" ? "8+" : count);

const pluralize = (count, term) => {
  const base = `${count} ${term}`;
  return count > 1 ? `${base}s` : base;
};

function getPeriodLabelFromMetricPeriodMonthsFilter(toggledValue) {
  const months = toNumber(toggledValue);

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - (months - 1));
  startDate.setDate(1);

  return `${moment(startDate).format("M/D/YYYY")} to present`;
}

function getTrailingLabelFromMetricPeriodMonthsFilter(toggledValue) {
  if (toggledValue === "1") {
    return "Current month";
  }
  if (toggledValue === "3" || toggledValue === "6" || toggledValue === "12") {
    return `Last ${toggledValue} months`;
  }
  return `Last ${parseInt(toggledValue, 10) / 12} years`;
}

const formatOfficerLabel = (label) => {
  if (!label) return "";
  const groups = label.split(" - ");
  return `${groups[0]} - ${toTitleCase(groups[1])}`;
};

const formatDistrictLabel = (label) => {
  if (!label) return "";
  const groups = label.match(/(.*)(?=DO)(.*)/) || label.match(/(.*)(?=-)(.*)/);
  return groups ? `${toTitleCase(groups[1])}${groups[2]}` : label;
};

const formatLargeNumber = (number) => {
  const ONE_MILLION = 1000000;
  if (number > ONE_MILLION) {
    return numeral(number).format("0a");
  }
  return numeral(number).format("0,0");
};

function formatPercent(percentage) {
  return `${Math.abs(percentage)}%`;
}

export {
  getPeriodLabelFromMetricPeriodMonthsFilter,
  getTrailingLabelFromMetricPeriodMonthsFilter,
  matrixViolationTypeToLabel,
  genderValueToHumanReadable,
  raceValueToHumanReadable,
  toHtmlFriendly,
  toHumanReadable,
  toInt,
  toTitleCase,
  humanReadableTitleCase,
  numberFromOfficerId,
  violationCountLabel,
  pluralize,
  raceValueToLabel,
  genderValueToLabel,
  getStatePopulations,
  getStatePopulationsLabels,
  formatOfficerLabel,
  formatDistrictLabel,
  formatLargeNumber,
  formatPercent,
};
