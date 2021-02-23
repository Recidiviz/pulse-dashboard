// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
import { translate } from "../../../../utils/i18nSettings";
import flags from "../../../../flags";
import { useRootStore } from "../../../../StoreProvider";

const CHART_TITLE = "Admissions by district";
const DEFAULT_MODE = "counts";

const RevocationsByDistrict = observer(
  ({ containerHeight, timeDescription }, ref) => {
    const { filters, dataStore, filtersStore } = useRootStore();
    const {
      districtKeys: { filterKey: districtFilterKey },
    } = filtersStore;
    const { revocationsChartStore } = dataStore;
    const currentDistricts = get(filters, districtFilterKey);

    return (
      <RevocationsByDimension
        ref={ref}
        chartId="admissionsByDistrict"
        dataStore={revocationsChartStore}
        containerHeight={containerHeight}
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
          revocationsChartStore.filteredData,
          currentDistricts
        )}
        chartTitle={CHART_TITLE}
        metricTitle={CHART_TITLE}
        timeDescription={timeDescription}
        modes={
          flags.enableRevocationRateByExit
            ? ["counts", "rates", "exits"]
            : ["counts", "rates"]
        }
        defaultMode={DEFAULT_MODE}
        dataExportLabel="District"
      />
    );
  },
  { forwardRef: true }
);

RevocationsByDistrict.defaultProps = { containerHeight: null };

RevocationsByDistrict.propTypes = {
  containerHeight: PropTypes.number,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByDistrict;
