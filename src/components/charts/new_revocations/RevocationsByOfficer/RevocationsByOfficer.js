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
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import RevocationCountChart from "../RevocationCountChart";
import createGenerateChartData from "./createGenerateChartData";
import flags from "../../../../flags";
import { dataStorePropTypes } from "../../propTypes";

const MAX_OFFICERS_COUNT = 50;

const RevocationsByOfficer = ({ dataStore, timeDescription }) => {
  const chartTitle = `Admissions by ${translate("officer")}`;
  const includeWarning = false;

  return (
    <RevocationsByDimension
      chartId={`${translate("revocations")}by${translate("Officer")}`}
      dataStore={dataStore}
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
      generateChartData={createGenerateChartData(dataStore)}
      chartTitle={chartTitle}
      metricTitle={chartTitle}
      timeDescription={timeDescription}
      modes={
        flags.enableRevocationRateByExit
          ? ["counts", "rates", "exits"]
          : ["counts", "rates"]
      }
      defaultMode="counts"
      dataExportLabel={translate("Officer")}
    />
  );
};

RevocationsByOfficer.propTypes = {
  dataStore: dataStorePropTypes.isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default observer(RevocationsByOfficer);
