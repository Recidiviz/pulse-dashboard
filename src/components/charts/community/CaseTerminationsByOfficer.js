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

import React from "react";
import PropTypes from "prop-types";

import { COLORS_SEVEN_VALUES } from "../../../assets/scripts/constants/colors";
import PerOfficerBarChart from "../common/bars/PerOfficerBarChart";

const chartId = "caseTerminationsByOfficer";

const CaseTerminationsByOfficer = ({
  terminationCountsByOfficer,
  officeData,
  metricType,
  metricPeriodMonths,
  supervisionType,
  district,
}) => (
  <PerOfficerBarChart
    chartId={chartId}
    exportLabel="Case terminations by officer"
    countsPerPeriodPerOfficer={terminationCountsByOfficer}
    officeData={officeData}
    metricType={metricType}
    metricPeriodMonths={metricPeriodMonths}
    supervisionType={supervisionType}
    district={district}
    bars={[
      { key: "absconsion", label: "Absconsion" },
      { key: "revocation", label: "Revocation" },
      { key: "suspension", label: "Suspension" },
      { key: "discharge", label: "Discharge" },
      { key: "expiration", label: "Expiration" },
      { key: "death", label: "Death" },
      { key: "other", label: "Other" },
    ]}
    yAxisLabel={metricType === "counts" ? "Case terminations" : "Percentage"}
    barColorPalette={COLORS_SEVEN_VALUES}
  />
);

CaseTerminationsByOfficer.defaultProps = {
  terminationCountsByOfficer: [],
};

CaseTerminationsByOfficer.propTypes = {
  terminationCountsByOfficer: PropTypes.arrayOf(PropTypes.shape({})),
  metricType: PropTypes.string.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  supervisionType: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  officeData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default CaseTerminationsByOfficer;
