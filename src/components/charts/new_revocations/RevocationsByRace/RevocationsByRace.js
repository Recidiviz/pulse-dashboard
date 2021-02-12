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
import getLabelByMode from "../utils/getLabelByMode";
import flags from "../../../../flags";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import { useDataStore } from "../../../../StoreProvider";
import HorizontalBarChartWithLabels from "../BarChartWithLabels/HorizontalBarChartWithLabels";

const RevocationsByRace = observer(
  ({ containerHeight, timeDescription }, ref) => {
    const dataStore = useDataStore();
    const { revocationsChartStore } = dataStore;
    return (
      <RevocationsByDimension
        ref={ref}
        chartId={`${translate("revocations")}ByRace`}
        dataStore={revocationsChartStore}
        containerHeight={containerHeight}
        renderChart={({ chartId, data, denominators, numerators, mode }) => (
          <HorizontalBarChartWithLabels
            activeTab={mode}
            id={chartId}
            data={data}
            numerators={numerators}
            denominators={denominators}
          />
        )}
        generateChartData={createGenerateChartData(revocationsChartStore)}
        chartTitle="Admissions by race/ethnicity and risk level"
        metricTitle={(mode) =>
          `${getLabelByMode(mode)} by race/ethnicity and risk level`
        }
        timeDescription={timeDescription}
        modes={
          flags.enableRevocationRateByExit
            ? ["rates", "exits"]
            : Object.keys(translate("raceLabelMap"))
        }
        defaultMode="WHITE"
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
