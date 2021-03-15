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
import { observer } from "mobx-react-lite";
import HistoricalSummaryMetrics from "./HistoricalSummaryMetrics";
import ProjectedSummaryMetrics from "./ProjectedSummaryMetrics";
import type {
  PopulationProjectionSummaryRecords,
  HistoricalSummaryRecord,
  ProjectedSummaryRecord,
} from "../models/types";
import { useCoreFiltersStore } from "../../components/StoreProvider";
import { recordMatchesSimulationTag } from "../models/PopulationProjectionSummaryMetric";
import "./PopulationSummaryMetrics.scss";
import type { Filters } from "../../RootStore/CoreFiltersStore";

type PropTypes = {
  isLoading?: boolean;
  isError: boolean;
  projectionSummaries?: PopulationProjectionSummaryRecords;
};

function applyDataFilters(filters: Filters) {
  return (record: PopulationProjectionSummaryRecords[number]) => {
    return record.timePeriod === filters.timePeriod;
  };
}
const PopulationSummaryMetrics: React.FC<PropTypes> = ({
  isError,
  isLoading = false,
  projectionSummaries = [],
}) => {
  const filtersStore = useCoreFiltersStore();
  const dataFilter = applyDataFilters(filtersStore.filters);

  // TODO: add in Error state
  if (isError) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="PopulationSummaryMetrics">
        <HistoricalSummaryMetrics isLoading />
        <ProjectedSummaryMetrics isLoading />
      </div>
    );
  }

  // Filter records
  const historicalData = projectionSummaries
    .filter(recordMatchesSimulationTag("HISTORICAL"))
    .find(dataFilter) as HistoricalSummaryRecord;

  const projectedData = projectionSummaries
    .filter(recordMatchesSimulationTag("POLICY_A"))
    .find(dataFilter) as ProjectedSummaryRecord;

  return (
    <div className="PopulationSummaryMetrics">
      <HistoricalSummaryMetrics isLoading={isLoading} data={historicalData} />
      <ProjectedSummaryMetrics isLoading={isLoading} data={projectedData} />
    </div>
  );
};

export default observer(PopulationSummaryMetrics);
