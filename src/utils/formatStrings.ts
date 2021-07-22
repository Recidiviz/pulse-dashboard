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
import { format, parseISO } from "date-fns";
import lowerCase from "lodash/fp/lowerCase";
import pipe from "lodash/fp/pipe";
import startCase from "lodash/fp/startCase";
import moment from "moment";
import numeral from "numeral";

import { translate } from "./i18nSettings";

function getStatePopulations(): string[] {
  return Object.keys(translate("populationChartAttributes"));
}

function getStatePopulationsLabels(): string[] {
  return Object.values(translate("populationChartAttributes"));
}

const genderValueToLabel: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
} as const;

const raceValueToLabel: Record<string, string> = {
  AMERICAN_INDIAN_ALASKAN_NATIVE: "American Indian Alaskan Native",
  ASIAN: "Asian",
  BLACK: "Black",
  HISPANIC: "Hispanic",
  NATIVE_HAWAIIAN_PACIFIC_ISLANDER: "Native Hawaiian Pacific Islander",
  WHITE: "White",
  OTHER: "Other",
  EXTERNAL_UNKNOWN: "Unknown",
} as const;

const matrixViolationTypeToLabel: Record<string, string> = {
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
} as const;

function genderValueToHumanReadable(genderValue: string): string {
  return genderValueToLabel[genderValue];
}

function raceValueToHumanReadable(raceValue: string): string {
  return raceValueToLabel[raceValue];
}

function toHtmlFriendly(string: string): string {
  return string.replace(/\W+/g, "-");
}

function toHumanReadable(string: string): string {
  return string.replace(/[-_]/g, " ");
}

function safeToInt(nonInt: string): number | string {
  return !Number.isNaN(Number(nonInt)) ? parseInt(nonInt) : nonInt;
}

function toInt(nonInt: string): number {
  return parseInt(nonInt);
}

function toTitleCase(str: string): string {
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
function numberFromOfficerId(officerId: string): number {
  // This works even for the described format, correctly parsing out 123
  return toInt(officerId);
}

const violationCountLabel = (count: string): string =>
  count === "8" ? "8+" : count;

const pluralize = (count: number, term: string): string => {
  const base = `${count} ${term}`;
  return count > 1 ? `${base}s` : base;
};

function getPeriodLabelFromMetricPeriodMonthsFilter(
  toggledValue: string
): string | null {
  const months = toNumber(toggledValue);

  if (!months) return "Invalid date to present";

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - (months - 1));
  startDate.setDate(1);

  return `${moment(startDate).format("M/D/YYYY")} to present`;
}

function getTrailingLabelFromMetricPeriodMonthsFilter(
  toggledValue: string
): string {
  if (toggledValue === "1") {
    return "Current month";
  }
  if (toggledValue === "3" || toggledValue === "6" || toggledValue === "12") {
    return `Last ${toggledValue} months`;
  }
  return `Last ${parseInt(toggledValue) / 12} years`;
}

const formatOfficerLabel = (label: string): string => {
  if (!label) return "";
  const groups = label.split(" - ");
  return `${groups[0]} - ${toTitleCase(groups[1])}`;
};

const formatDistrictLabel = (label: string): string => {
  if (!label) return "";
  const groups = label.match(/(.*)(?=DO)(.*)/) || label.match(/(.*)(?=-)(.*)/);
  return groups ? `${toTitleCase(groups[1])}${groups[2]}` : label;
};

const formatLargeNumber = (number: number): string => {
  const ONE_MILLION = 1000000;
  if (Math.abs(number) >= ONE_MILLION) {
    return `${(number / ONE_MILLION).toFixed(1)}M`;
  }
  return numeral(number).format("0,0");
};

function toNumber(stringValue: string): null | number {
  return !Number.isNaN(Number(stringValue)) ? Number(stringValue) : null;
}

function formatPercent(percentage: number): string {
  return `${numeral(Math.abs(percentage)).format("0")}%`;
}

function formatISODateString(date: string): string {
  return format(parseISO(date), "M/d/yy");
}

function formatDate(date: Date, pattern = "M/d/yy"): string {
  return format(date, pattern);
}

function getFirstName(fullName: string): string {
  return fullName.split(" ")[0];
}

function toPossessive(name: string): string {
  return `${name}'s`;
}

export {
  formatDate,
  formatDistrictLabel,
  formatISODateString,
  formatLargeNumber,
  formatOfficerLabel,
  formatPercent,
  genderValueToHumanReadable,
  genderValueToLabel,
  getFirstName,
  getPeriodLabelFromMetricPeriodMonthsFilter,
  getStatePopulations,
  getStatePopulationsLabels,
  getTrailingLabelFromMetricPeriodMonthsFilter,
  humanReadableTitleCase,
  matrixViolationTypeToLabel,
  numberFromOfficerId,
  pluralize,
  raceValueToHumanReadable,
  raceValueToLabel,
  safeToInt,
  toHtmlFriendly,
  toHumanReadable,
  toInt,
  toNumber,
  toPossessive,
  toTitleCase,
  violationCountLabel,
};
