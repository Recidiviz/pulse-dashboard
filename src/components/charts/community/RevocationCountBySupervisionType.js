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
import { COLORS_STACKED_TWO_VALUES } from "../../../assets/scripts/constants/colors";
import { METRIC_TYPES } from "../../constants";
import { metricTypePropType } from "../propTypes";

const chartId = "revocationsBySupervisionType";

const RevocationCountBySupervisionType = ({
  metricType,
  metricPeriodMonths,
  district,
  revocationCountsByMonthBySupervisionType,
}) => (
  <PerMonthBarChart
    chartId={chartId}
    exportLabel="Revocation counts by supervision type"
    countsByMonth={revocationCountsByMonthBySupervisionType}
    metricType={metricType}
    numMonths={metricPeriodMonths}
    filters={{ district }}
    bars={[
      { key: "probation_count", label: "Probation" },
      { key: "parole_count", label: "Parole" },
    ]}
    yAxisLabel={
      metricType === METRIC_TYPES.COUNTS ? "Revocation count" : "Percentage"
    }
    barColorPalette={COLORS_STACKED_TWO_VALUES}
    dataExportLabel="Month"
  />
);

RevocationCountBySupervisionType.propTypes = {
  metricType: metricTypePropType.isRequired,
  metricPeriodMonths: PropTypes.string.isRequired,
  district: PropTypes.arrayOf(PropTypes.string).isRequired,
  revocationCountsByMonthBySupervisionType: PropTypes.arrayOf(
    PropTypes.shape({
      district: PropTypes.string,
      month: PropTypes.string,
      parole_count: PropTypes.string,
      probation_count: PropTypes.string,
      state_code: PropTypes.string,
      year: PropTypes.string,
    })
  ).isRequired,
};

export default RevocationCountBySupervisionType;
