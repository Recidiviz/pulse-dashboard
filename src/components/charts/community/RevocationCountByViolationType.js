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

import PerMonthBarChart from "../common/bars/PerMonthBarChart";
import { COLORS_FIVE_VALUES } from "../../../assets/scripts/constants/colors";
import { metricTypePropType } from "../propTypes";
import { METRIC_TYPES } from "../../constants";

const chartId = "revocationsByViolationType";

const RevocationCountByViolationType = ({
  revocationCountsByMonthByViolationType,
  metricType,
  metricPeriodMonths,
  supervisionType,
  district,
}) => (
  <PerMonthBarChart
    chartId={chartId}
    exportLabel="Revocation counts by violation type"
    countsByMonth={revocationCountsByMonthByViolationType}
    metricType={metricType}
    numMonths={metricPeriodMonths}
    filters={{
      district,
      supervisionType,
    }}
    bars={[
      { key: "absconsion_count", label: "Absconsion" },
      { key: "felony_count", label: "New Offense" },
      { key: "technical_count", label: "Technical" },
      { key: "unknown_count", label: "Unknown Type" },
    ]}
    yAxisLabel={
      metricType === METRIC_TYPES.COUNTS ? "Revocation count" : "Percentage"
    }
    barColorPalette={COLORS_FIVE_VALUES}
    dataExportLabel="Month"
  />
);

RevocationCountByViolationType.propTypes = {
  metricType: metricTypePropType.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  supervisionType: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  revocationCountsByMonthByViolationType: PropTypes.arrayOf(
    PropTypes.shape({
      absconsion_count: PropTypes.string,
      district: PropTypes.string,
      felony_count: PropTypes.string,
      month: PropTypes.string,
      state_code: PropTypes.string,
      supervision_type: PropTypes.string,
      technical_count: PropTypes.string,
      unknown_count: PropTypes.string,
      year: PropTypes.string,
    })
  ).isRequired,
};

export default RevocationCountByViolationType;
