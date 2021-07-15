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

import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import React from "react";

import flags from "../../flags";
import { translate } from "../../utils/i18nSettings";
import BarChartWithLabels from "../BarCharts";
import { useDataStore } from "../LanternStoreProvider";
import RevocationsByDimension from "../RevocationsByDimension";
import getLabelByMode from "../utils/getLabelByMode";
import createGenerateChartData from "./createGenerateChartData";

const DEFAULT_MODE = "rates";

const RevocationsByRiskLevel = observer(
  ({ containerHeight, timeDescription }, ref) => {
    const dataStore = useDataStore();
    const { revocationsChartStore } = dataStore;
    const CHART_TITLE = translate("revocationsByRiskLevelChartTitle");
    const CHART_ID = translate("revocationsByRiskLevelChartId");

    return (
      <RevocationsByDimension
        ref={ref}
        chartId={CHART_ID}
        dataStore={revocationsChartStore}
        containerHeight={containerHeight}
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
        generateChartData={createGenerateChartData(
          revocationsChartStore.filteredData
        )}
        chartTitle={CHART_TITLE}
        metricTitle={(mode) => `${getLabelByMode(mode)} by risk level`}
        timeDescription={timeDescription}
        modes={flags.enableRevocationRateByExit ? ["rates", "exits"] : []}
        defaultMode={DEFAULT_MODE}
        dataExportLabel="Risk Level"
      />
    );
  },
  { forwardRef: true }
);

RevocationsByRiskLevel.defaultProps = { containerHeight: null };

RevocationsByRiskLevel.propTypes = {
  containerHeight: PropTypes.number,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByRiskLevel;
