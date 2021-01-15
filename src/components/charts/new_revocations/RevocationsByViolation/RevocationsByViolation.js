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
import createGenerateChartData from "./createGenerateChartData";
import BarChartWithLabels from "../BarChartWithLabels";
import { translate } from "../../../../views/tenants/utils/i18nSettings";
import { useRootStore } from "../../../../StoreProvider";
import { VIOLATION_TYPE } from "../../../../constants/filterTypes";

const RevocationsByViolation = ({ dataStore, timeDescription }) => {
  const { filtersStore } = useRootStore();
  const violationTypes = filtersStore.filterOptions[VIOLATION_TYPE].options;

  return (
    <RevocationsByDimension
      chartId={`${translate("revocations")}ByViolationType`}
      dataStore={dataStore}
      renderChart={({ chartId, data, denominators, numerators }) => (
        <BarChartWithLabels
          data={data}
          numerators={numerators}
          denominators={denominators}
          id={chartId}
          yAxisLabel="Percent of total reported violations"
          xAxisLabel="Violation type and condition violated"
        />
      )}
      generateChartData={createGenerateChartData(dataStore, violationTypes)}
      chartTitle="Relative frequency of violation types"
      metricTitle="Relative frequency of violation types"
      timeDescription={timeDescription}
      dataExportLabel="Violation"
    />
  );
};

RevocationsByViolation.propTypes = {
  dataStore: PropTypes.shape({
    filteredData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
  }).isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default observer(RevocationsByViolation);
