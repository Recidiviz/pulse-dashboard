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
import { makeAutoObservable } from "mobx";

import { downloadChartAsData } from "../../utils/downloads/downloadData";
import {
  formatDate,
  toHumanReadable,
  toTitleCase,
} from "../../utils/formatStrings";
import { PopulationProjectionTimeSeriesRecord } from "../models/types";
import { DownloadableData, DownloadableDataset } from "../PageVitals/types";
import {
  formatMonthAndYear,
  getRecordDate,
} from "../PopulationTimeSeriesChart/helpers";
import { PopulationFilters } from "../types/filters";
import { FILTER_TYPES } from "../utils/constants";
import filterOptions from "../utils/filterOptions";
import { getCompartmentFromView } from "../views";
import type CoreStore from ".";

export default class PageProjectionsStore {
  protected readonly rootStore;

  constructor({ rootStore }: { rootStore: CoreStore }) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.fetchMethodologyPDF = this.fetchMethodologyPDF.bind(this);
    this.downloadData = this.downloadData.bind(this);
  }

  get timeSeriesDownloadableData(): DownloadableData | undefined {
    const { view } = this.rootStore;
    const filteredData = this.rootStore.metricsStore.projections.getFilteredDataByView(
      view
    );
    if (!filteredData) return undefined;

    const datasets = [] as DownloadableDataset[];
    const data: Record<string, number>[] = [];
    const labels: string[] = [];

    filteredData.forEach((d: PopulationProjectionTimeSeriesRecord) => {
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

  get filtersText(): string {
    const { view, currentTenantId } = this.rootStore;
    if (!currentTenantId) return "";

    const options = filterOptions[currentTenantId];
    if (!options) return "";

    const compartment = getCompartmentFromView(view);
    const filterTypes = Object.keys(options) as Array<
      Required<keyof PopulationFilters>
    >;
    const enabledFilters = filterTypes
      .map((filterType) => {
        const filter = options[filterType];
        if (!filter.enabledViews.includes(view)) return undefined;
        return filter;
      })
      .filter((f) => f && f.type !== FILTER_TYPES.TIME_PERIOD);

    const description = enabledFilters.map(
      (filter) =>
        filter &&
        `${filter.title}: ${toTitleCase(
          toHumanReadable(this.rootStore.filtersStore.filters[filter?.type])
        )}`
    );
    description.unshift(
      `${toTitleCase(compartment)} - ${
        this.rootStore.filtersStore.timePeriodLabel
      }`
    );
    return description.join("; ");
  }

  async fetchMethodologyPDF(): Promise<Record<string, any>> {
    const endpoint = `${process.env.REACT_APP_API_URL}/api/${this.rootStore.currentTenantId}/projections/methodology.pdf`;
    const pdf = await fetch(endpoint);
    return {
      data: await pdf.blob(),
      type: "binary",
      name: "methodology.pdf",
    };
  }

  async downloadData(): Promise<void> {
    return downloadChartAsData({
      fileContents: [this.timeSeriesDownloadableData],
      chartTitle: `Population Projections: ${this.filtersText}`,
      shouldZipDownload: true,
      getTokenSilently: this.rootStore.userStore.getTokenSilently,
      includeFiltersDescriptionInCSV: true,
      filters: { filtersDescription: this.filtersText },
      lastUpdatedOn: formatDate(
        this.rootStore.metricsStore.projections.simulationDate
      ),
      methodologyPDF: await this.fetchMethodologyPDF(),
    });
  }
}
