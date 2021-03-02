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

import PerMonthBarChart from "../bars/PerMonthBarChart";
import { COLORS_FIVE_VALUES } from "../../assets/scripts/constants/colors";
import { metricTypePropType } from "../utils/propTypes";
import { METRIC_TYPES } from "../utils/constants";

const chartId = "ftrReferralsByParticipationStatus";

const chartColors = [
  COLORS_FIVE_VALUES[0],
  COLORS_FIVE_VALUES[1],
  COLORS_FIVE_VALUES[2],
  COLORS_FIVE_VALUES[3],
];

const FtrReferralsByParticipationStatus = ({
  ftrReferralsByParticipationStatus,
  metricType,
  metricPeriodMonths,
  supervisionType,
  district,
}) => (
  <PerMonthBarChart
    chartId={chartId}
    exportLabel="FTR Referrals by Participation Status"
    countsByMonth={ftrReferralsByParticipationStatus}
    metricType={metricType}
    numMonths={metricPeriodMonths}
    filters={{
      district,
      supervisionType,
    }}
    bars={[
      { key: "pending", label: "Pending" },
      { key: "in_progress", label: "In Progress" },
      { key: "denied", label: "Denied" },
      { key: "discharged", label: "Discharged" },
    ]}
    yAxisLabel={metricType === METRIC_TYPES.COUNTS ? "Count" : "Percentage"}
    barColorPalette={chartColors}
    dataExportLabel="Month\Status"
  />
);

FtrReferralsByParticipationStatus.propTypes = {
  metricType: metricTypePropType.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  supervisionType: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  ftrReferralsByParticipationStatus: PropTypes.arrayOf(
    PropTypes.shape({
      denied: PropTypes.string,
      discharged: PropTypes.string,
      district: PropTypes.string,
      in_progress: PropTypes.string,
      month: PropTypes.string,
      pending: PropTypes.string,
      state_code: PropTypes.string,
      supervision_type: PropTypes.string,
      year: PropTypes.string,
    })
  ).isRequired,
};

export default FtrReferralsByParticipationStatus;
