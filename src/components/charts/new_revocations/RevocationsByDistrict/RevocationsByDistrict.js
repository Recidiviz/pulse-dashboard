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
import { observer } from "mobx-react-lite";

import RevocationsByDimension from "../RevocationsByDimension";
import PercentRevokedChart from "../PercentRevokedChart";
import RevocationCountChart from "../RevocationCountChart";
import createGenerateChartData from "./createGenerateChartData";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import flags from "../../../../flags";
import { useRootStore } from "../../../../StoreProvider";

const chartTitle = "Admissions by district";

const RevocationsByDistrict = ({ timeDescription, dataFilter }) => {
  const { currentTenantId } = useRootStore();

  return (
    <RevocationsByDimension
      chartId={`${translate("revocations")}ByDistrict`}
      apiUrl={`${currentTenantId}/newRevocations`}
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
                : "Percent revoked out of all exits"
            }
          />
        )
      }
      generateChartData={createGenerateChartData(dataFilter)}
      chartTitle={chartTitle}
      metricTitle={chartTitle}
      timeDescription={timeDescription}
      modes={
        flags.enableRevocationRateByExit
          ? ["counts", "rates", "exits"]
          : ["counts", "rates"]
      }
      defaultMode="counts"
      dataExportLabel="District"
    />
  );
};

RevocationsByDistrict.propTypes = {
  dataFilter: PropTypes.func.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default observer(RevocationsByDistrict);
