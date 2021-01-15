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

import BarChartWithLabels from "../BarChartWithLabels";
import RevocationsByDimension from "../RevocationsByDimension";
import createGenerateChartData from "./createGenerateChartData";
import getLabelByMode from "../utils/getLabelByMode";
import { COLORS_LANTERN_SET } from "../../../../assets/scripts/constants/colors";
import flags from "../../../../flags";
import { translate } from "../../../../views/tenants/utils/i18nSettings";

const RevocationsByRace = ({ dataStore, timeDescription }) => {
  return (
    <RevocationsByDimension
      chartId={`${translate("revocations")}ByRace`}
      dataStore={dataStore}
      renderChart={({ chartId, data, denominators, numerators, mode }) => (
        <BarChartWithLabels
          id={chartId}
          data={data}
          labelColors={COLORS_LANTERN_SET}
          xAxisLabel="Race/ethnicity and risk level"
          yAxisLabel={getLabelByMode(mode)}
          numerators={numerators}
          denominators={denominators}
        />
      )}
      generateChartData={createGenerateChartData(dataStore)}
      chartTitle="Admissions by race/ethnicity and risk level"
      metricTitle={(mode) =>
        `${getLabelByMode(mode)} by race/ethnicity and risk level`
      }
      timeDescription={timeDescription}
      modes={flags.enableRevocationRateByExit ? ["rates", "exits"] : []}
      defaultMode="rates"
      dataExportLabel="Risk Level"
    />
  );
};

RevocationsByRace.propTypes = {
  dataStore: PropTypes.shape({
    filteredData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
  }).isRequired,
  timeDescription: PropTypes.string.isRequired,
};

export default observer(RevocationsByRace);
