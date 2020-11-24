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

import flags from "../../../../flags";
import { filtersPropTypes } from "../../propTypes";
import getLabelByMode from "../utils/getLabelByMode";
import createGenerateChartData from "./createGenerateChartData";
import RevocationsByDimension from "../RevocationsByDimension";
import BarChartWithLabels from "../BarChartWithLabels";
import { translate } from "../../../../views/tenants/utils/i18nSettings";

const RevocationsByRiskLevel = ({
  stateCode,
  dataFilter,
  filterStates,
  timeDescription,
}) => (
  <RevocationsByDimension
    chartId={`${translate("revocations")}ByRiskLevel`}
    apiUrl={`${stateCode}/newRevocations`}
    apiFile="revocations_matrix_distribution_by_risk_level"
    renderChart={({ chartId, data, denominators, numerators, mode }) => (
      <BarChartWithLabels
        id={chartId}
        data={data}
        denominators={denominators}
        numerators={numerators}
        xAxisLabel="Risk level"
        yAxisLabel={getLabelByMode(mode)}
      />
    )}
    generateChartData={createGenerateChartData(dataFilter)}
    chartTitle={`${translate("Revocations")} by risk level`}
    metricTitle={(mode) => `${getLabelByMode(mode)} by risk level`}
    filterStates={filterStates}
    timeDescription={timeDescription}
    modes={flags.enableRevocationRateByExit ? ["rates", "exits"] : []}
    defaultMode="rates"
  />
);

RevocationsByRiskLevel.propTypes = {
  stateCode: PropTypes.string.isRequired,
  dataFilter: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByRiskLevel;
