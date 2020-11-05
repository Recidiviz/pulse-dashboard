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

import { filtersPropTypes } from "../../propTypes";
import RevocationsByDimension from "../RevocationsByDimension";
import PercentRevokedChart from "../PercentRevokedChart";
import RevocationCountChart from "../RevocationCountChart";
import createGenerateChartData from "./createGenerateChartData";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import flags from "../../../../flags";

const RevocationsByDistrict = ({
  currentDistricts,
  dataFilter,
  filterStates,
  stateCode,
  timeDescription,
}) => {
  const chartTitle = `${translate("Revocations")} by district`;

  return (
    <RevocationsByDimension
      chartId="revocationsByDistrict"
      apiUrl={`${stateCode}/newRevocations`}
      apiFile="revocations_matrix_distribution_by_district"
      renderChart={({
        chartId,
        data,
        denominators,
        numerators,
        averageRate,
        mode,
      }) =>
        mode === "counts" ? (
          <RevocationCountChart
            chartId={chartId}
            data={data}
            xAxisLabel="District"
          />
        ) : (
          <PercentRevokedChart
            data={data}
            chartId={chartId}
            numerators={numerators}
            denominators={denominators}
            averageRate={averageRate}
            xAxisLabel="District"
            yAxisLabel={
              mode === "rates"
                ? translate("percentOfPopulationRevoked")
                : `Percent ${translate("revoked")} out of all exits`
            }
          />
        )
      }
      generateChartData={createGenerateChartData(dataFilter, currentDistricts)}
      chartTitle={chartTitle}
      metricTitle={chartTitle}
      filterStates={filterStates}
      timeDescription={timeDescription}
      modes={
        flags.enableRevocationRateByExit
          ? ["counts", "rates", "exits"]
          : ["counts", "rates"]
      }
      defaultMode="counts"
    />
  );
};

RevocationsByDistrict.propTypes = {
  dataFilter: PropTypes.func.isRequired,
  filterStates: filtersPropTypes.isRequired,
  currentDistricts: PropTypes.arrayOf(PropTypes.string).isRequired,
  stateCode: PropTypes.string.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByDistrict;
