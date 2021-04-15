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
import createGenerateChartData from "./createGenerateChartData";
import { translate } from "../../utils/i18nSettings";
import { useDataStore, useRootStore } from "../../components/StoreProvider";
import HorizontalBarChartWithLabels from "../BarCharts/HorizontalBarChartWithLabels";
import { US_PA } from "../../RootStore/TenantStore/lanternTenants";
import flags from "../../flags";

const DEFAULT_MODE = "WHITE";

const RevocationsByRace = observer(
  ({ containerHeight, timeDescription }, ref) => {
    const dataStore = useDataStore();
    const { currentTenantId } = useRootStore();

    const { revocationsChartStore } = dataStore;
    const CHART_TITLE = translate("revocationsByRaceChartTitle");
    const CHART_ID = translate("revocationsByRaceChartId");
    const stacked =
      flags.enableUpdatedRaceGenderCharts && currentTenantId === US_PA;

    return (
      <RevocationsByDimension
        ref={ref}
        chartId={CHART_ID}
        dataStore={revocationsChartStore}
        containerHeight={containerHeight}
        renderChart={({ chartId, data, denominators, numerators }) => (
          <HorizontalBarChartWithLabels
            id={chartId}
            data={data}
            numerators={numerators}
            denominators={denominators}
            stacked={stacked}
          />
        )}
        generateChartData={createGenerateChartData(
          revocationsChartStore,
          stacked
        )}
        chartTitle={CHART_TITLE}
        metricTitle={(mode) =>
          `${CHART_TITLE}: ${translate("raceLabelMap")[mode]}`
        }
        timeDescription={timeDescription}
        modes={stacked ? [] : Object.keys(translate("raceLabelMap"))}
        defaultMode={DEFAULT_MODE}
        dataExportLabel="Race"
      />
    );
  },
  { forwardRef: true }
);

RevocationsByRace.defaultProps = { containerHeight: null };

RevocationsByRace.propTypes = {
  containerHeight: PropTypes.number,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByRace;
