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

import { translate } from "../../utils/i18nSettings";
import RevocationsByDimension from "../RevocationsByDimension";
import HorizontalBarChartWithLabels from "../BarCharts/HorizontalBarChartWithLabels";
import createGenerateChartData from "./createGenerateChartData";
import { useRootStore } from "../../components/StoreProvider";
import { genderValueToLabel } from "../../utils/labels";

const DEFAULT_MODE = "MALE";

const RevocationsByGender = observer(
  ({ containerHeight, timeDescription }, ref) => {
    const { dataStore } = useRootStore();
    const { revocationsChartStore } = dataStore;

    const CHART_TITLE = `Admissions by ${translate("gender")}`;

    return (
      <RevocationsByDimension
        ref={ref}
        chartId={`admissionsBy${translate("Gender")}`}
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
        metricTitle={(mode) => `${CHART_TITLE}: ${mode}`}
        timeDescription={timeDescription}
        modes={Object.keys(genderValueToLabel)}
        defaultMode={DEFAULT_MODE}
        dataExportLabel="Gender"
      />
    );
  },
  { forwardRef: true }
);

RevocationsByGender.defaultProps = { containerHeight: null };

RevocationsByGender.propTypes = {
  containerHeight: PropTypes.number,
  timeDescription: PropTypes.string.isRequired,
};

export default RevocationsByGender;
