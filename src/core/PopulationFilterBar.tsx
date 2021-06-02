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
import { get } from "mobx";

import { CoreSelect } from "./controls/CoreSelect";
import { useCoreStore } from "./CoreStoreProvider";
import { getFilterOption } from "./utils/filterOptions";
import { PopulationFilters, PopulationFilterValues } from "./types/filters";

import Filter from "./controls/Filter";
import FilterBar from "./controls/FilterBar";
import { CORE_PATHS, CORE_VIEWS, getCompartmentFromView } from "./views";
import DownloadDataButton from "./DownloadDataButton";
import MethodologyLink from "./MethodologyLink";
import DetailsGroup from "./DetailsGroup";
import { PopulationProjectionTimeSeriesRecord } from "./models/types";
import { DownloadableDataset } from "./PageVitals/types";
import content from "./content";
import {
  formatMonthAndYear,
  getRecordDate,
} from "./PopulationTimeSeriesChart/helpers";
import { toTitleCase, formatDate } from "../utils/formatStrings";

function getTimeSeriesDownloadableData(
  timeSeries: PopulationProjectionTimeSeriesRecord[]
) {
  if (!timeSeries) return undefined;

  const datasets = [] as DownloadableDataset[];
  const data: Record<string, number>[] = [];
  const labels: string[] = [];

  timeSeries.forEach((d: PopulationProjectionTimeSeriesRecord) => {
    data.push({
      Population: Math.round(d.totalPopulation),
      "CI Lower": Math.round(d.totalPopulationMin),
      "CI Upper": Math.round(d.totalPopulationMax),
    });

    labels.push(formatMonthAndYear(getRecordDate(d)));
  });

  datasets.push({ data, label: "" });

  return {
    chartDatasets: datasets,
    chartLabels: labels,
    chartId: "Population Projection",
    dataExportLabel: "Month",
  };
}

function getFiltersText(
  filters: PopulationFilterValues,
  view: keyof typeof CORE_VIEWS,
  timePeriodLabel: string
): string {
  const { gender, supervisionType } = filters;
  const compartment = getCompartmentFromView(view);
  return `${toTitleCase(
    compartment
  )} - ${timePeriodLabel}; Gender: ${toTitleCase(
    gender
  )}; Supervision Type: ${toTitleCase(supervisionType)},,,`;
}

const PopulationFilterBar: React.FC<{
  view: keyof typeof CORE_VIEWS;
  filterOptions: PopulationFilters;
}> = ({ filterOptions, view }) => {
  const { filtersStore, metricsStore } = useCoreStore();
  const { filters, timePeriodLabel } = filtersStore;
  const filterTypes = Object.keys(filterOptions) as Array<
    keyof PopulationFilters
  >;
  const { simulationDate } = metricsStore.projections;
  const filteredData = metricsStore.projections.getFilteredDataByView(view);
  // @ts-ignore TODO TS
  const { vitals: vitalsMethodology } = content.US_ND;

  return (
    <FilterBar
      details={
        <DetailsGroup>
          <DownloadDataButton
            data={[getTimeSeriesDownloadableData(filteredData)]}
            title={`Population Projections: ${getFiltersText(
              filters,
              view,
              timePeriodLabel
            )}`}
            methodology={vitalsMethodology.content}
            lastUpdatedOn={formatDate(simulationDate)}
            filters={getFiltersText(filters, view, timePeriodLabel)}
            includeFiltersRowInCSV
          />
          <MethodologyLink path={CORE_PATHS.methodologyProjections} />
        </DetailsGroup>
      }
    >
      {filterTypes.map((filterType) => {
        const filter = filterOptions[filterType];
        if (!filter.enabledViews.includes(view)) return null;
        return (
          <Filter
            key={`${view}-${filterType}`}
            title={filter.title}
            width={filter.width}
          >
            <CoreSelect
              value={getFilterOption(get(filters, filter.type), filter.options)}
              options={filter.options}
              onChange={filter.setFilters(filtersStore)}
              defaultValue={filter.defaultValue}
            />
          </Filter>
        );
      })}
    </FilterBar>
  );
};

export default observer(PopulationFilterBar);
