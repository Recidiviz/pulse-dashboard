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
import { useDataStore } from "../../StoreProvider";
import HorizontalBarChartWithLabels from "../BarCharts/HorizontalBarChartWithLabels";

const CHART_TITLE = "Admissions by race/ethnicity";
const DEFAULT_MODE = "WHITE";

const RevocationsByRace = observer(
  ({ containerHeight, timeDescription }, ref) => {
    const dataStore = useDataStore();
    const { revocationsChartStore } = dataStore;
    return (
      <RevocationsByDimension
        ref={ref}
        chartId="admissionsByRace"
        dataStore={revocationsChartStore}
        containerHeight={containerHeight}
        renderChart={({ chartId, data, denominators, numerators }) => (
          <HorizontalBarChartWithLabels
            id={chartId}
            data={data}
            numerators={numerators}
            denominators={denominators}
          />
        )}
        generateChartData={createGenerateChartData(revocationsChartStore)}
        chartTitle={CHART_TITLE}
        metricTitle={(mode) =>
          `${CHART_TITLE}: ${translate("raceLabelMap")[mode]}`
        }
        timeDescription={timeDescription}
        modes={Object.keys(translate("raceLabelMap"))}
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
