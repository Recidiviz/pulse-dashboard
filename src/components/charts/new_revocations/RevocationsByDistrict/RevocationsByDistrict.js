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
import { get } from "mobx";

import RevocationsByDimension from "../RevocationsByDimension";
import PercentRevokedChart from "../PercentRevokedChart";
import RevocationCountChart from "../RevocationCountChart";
import createGenerateChartData from "./createGenerateChartData";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import flags from "../../../../flags";
import { useRootStore } from "../../../../StoreProvider";
import { DISTRICT } from "../../../../constants/filterTypes";

const chartTitle = "Admissions by district";

const RevocationsByDistrict = ({ timeDescription, dataStore }) => {
  const { filters } = useRootStore();
  const currentDistricts = get(filters, DISTRICT);

  return (
    <RevocationsByDimension
      chartId={`${translate("revocations")}ByDistrict`}
      dataStore={dataStore}
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
      generateChartData={createGenerateChartData(
        dataStore.filteredData,
        currentDistricts
      )}
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
  dataStore: PropTypes.shape({
    filteredData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
  }).isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default observer(RevocationsByDistrict);
