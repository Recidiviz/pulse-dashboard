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

import { translate } from "../../../../views/tenants/utils/i18nSettings";
import { filtersPropTypes } from "../../propTypes";
import getLabelByMode from "../utils/getLabelByMode";

import RevocationsByDimension from "../RevocationsByDimension";
import BarChartWithLabels from "../BarChartWithLabels";
import { CHART_COLORS } from "./constants";
import createGenerateChartData from "./createGenerateChartData";
import flags from "../../../../flags";

const RevocationsByGender = ({
  stateCode,
  dataFilter,
  filterStates,
  timeDescription,
}) => (
  <RevocationsByDimension
    chartId={`${translate("revocations")}By${translate("Gender")}`}
    apiUrl={`${stateCode}/newRevocations`}
    apiFile="revocations_matrix_distribution_by_gender"
    renderChart={({ chartId, data, denominators, numerators, mode }) => (
      <BarChartWithLabels
        id={chartId}
        data={data}
        xAxisLabel={`${translate("Gender")} and risk level`}
        yAxisLabel={getLabelByMode(mode)}
        labelColors={CHART_COLORS}
        denominators={denominators}
        numerators={numerators}
      />
    )}
    generateChartData={createGenerateChartData(dataFilter, stateCode)}
    chartTitle={`Admissions by ${translate("gender")} and risk level`}
    metricTitle={(mode) =>
      `${getLabelByMode(mode)} by ${translate("gender")} and risk level`
    }
    filterStates={filterStates}
    timeDescription={timeDescription}
    modes={flags.enableRevocationRateByExit ? ["rates", "exits"] : []}
    defaultMode="rates"
    dataExportLabel="Risk Level"
  />
);

RevocationsByGender.propTypes = {
  stateCode: PropTypes.string.isRequired,
  dataFilter: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByGender;
