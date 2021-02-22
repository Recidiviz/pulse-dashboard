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

import RevocationsByDimension from "../RevocationsByDimension";
import PercentRevokedChart from "../PercentRevokedChart";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import RevocationCountChart from "../RevocationCountChart";
import createGenerateChartData from "./createGenerateChartData";
import flags from "../../../../flags";
import { useDataStore } from "../../../../StoreProvider";

const MAX_OFFICERS_COUNT = 50;
const DEFAULT_MODE = "counts";

const RevocationsByOfficer = observer(
  ({ containerHeight, timeDescription }, ref) => {
    const dataStore = useDataStore();
    const { revocationsChartStore } = dataStore;

    const CHART_TITLE = `Admissions by ${translate("officer")}`;
    const includeWarning = false;

    return (
      <RevocationsByDimension
        ref={ref}
        chartId={`${translate("revocations")}by${translate("Officer")}`}
        dataStore={revocationsChartStore}
        containerHeight={containerHeight}
        includeWarning={includeWarning}
        renderChart={({
          chartId,
          data,
          denominators,
          numerators,
          averageRate,
          mode,
        }) => {
          const slicedData = {
            datasets: data.datasets.map((dataset) => ({
              ...dataset,
              data: dataset.data.slice(0, MAX_OFFICERS_COUNT),
            })),
            labels: data.labels.slice(0, MAX_OFFICERS_COUNT),
          };

          return mode === "counts" ? (
            <RevocationCountChart
              chartId={chartId}
              data={slicedData}
              xAxisLabel={`District-${translate("Officer")} ID`}
            />
          ) : (
            <PercentRevokedChart
              data={slicedData}
              chartId={chartId}
              numerators={numerators}
              denominators={denominators}
              averageRate={averageRate}
              xAxisLabel={`District-${translate("Officer")} ID`}
              yAxisLabel={
                mode === "rates"
                  ? translate("percentOfPopulationRevoked")
                  : `Percent ${translate("revoked")} out of all exits`
              }
              includeWarning={includeWarning}
            />
          );
        }}
        generateChartData={createGenerateChartData(
          revocationsChartStore.filteredData
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
        dataExportLabel={translate("Officer")}
      />
    );
  },
  { forwardRef: true }
);

RevocationsByOfficer.defaultProps = { containerHeight: null };

RevocationsByOfficer.propTypes = {
  containerHeight: PropTypes.number,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByOfficer;
