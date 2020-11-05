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

import RevocationsByDimension from "../RevocationsByDimension";
import createGenerateChartData from "./createGenerateChartData";
import { filtersPropTypes } from "../../propTypes";
import BarChartWithLabels from "../BarChartWithLabels";

const RevocationsByViolation = ({
  dataFilter,
  filterStates,
  stateCode,
  timeDescription,
  violationTypes,
}) => (
  <RevocationsByDimension
    chartId="revocationsByViolationType"
    apiUrl={`${stateCode}/newRevocations`}
    apiFile="revocations_matrix_distribution_by_violation"
    renderChart={({ chartId, data, denominators, numerators }) => (
      <BarChartWithLabels
        data={data}
        numerators={numerators}
        denominators={denominators}
        id={chartId}
        yAxisLabel="Percent of total reported violations"
        xAxisLabel="Violation type and condition violated"
      />
    )}
    generateChartData={createGenerateChartData(dataFilter, violationTypes)}
    chartTitle="Relative frequency of violation types"
    metricTitle="Relative frequency of violation types"
    filterStates={filterStates}
    timeDescription={timeDescription}
  />
);

RevocationsByViolation.propTypes = {
  dataFilter: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  stateCode: PropTypes.string.isRequired,
  timeDescription: PropTypes.string.isRequired,
  violationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RevocationsByViolation;
