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
import { computed, makeObservable, observable, runInAction } from "mobx";
import { TenantId, RawMetricData, MetricRecord, MetricTypeId } from "./types";
import { callMetricsApi } from "../../api/metrics/metricsClient";

// how am i gonna get the token from the tenant store / user store
// how to connect models to the overall stores
export async function fetchAndTransformMetric<RecordFormat>({
  sourceFileName,
  tenantId,
  transformFn,
}: {
  sourceFileName: string;
  tenantId: TenantId;
  transformFn: (d: RawMetricData) => RecordFormat[];
}): Promise<RecordFormat[]> {
  const apiResponse = await callMetricsApi({
    metricNames: [sourceFileName],
    tenantId,
  });

  const rawData = apiResponse[sourceFileName];
  if (rawData) {
    return transformFn(rawData);
  }
  throw new Error("no metric data");
}

export type MetricProps<RecordFormat extends MetricRecord> = {
  id: MetricTypeId;
  tenantId: TenantId;
  sourceFileName: string;
  dataTransformer: (d: RawMetricData) => RecordFormat[];
};

/**
 * Represents a single dataset backed by our metrics API,
 * plus any applicable metadata.
 * This is an abstract class that cannot be instantiated directly!
 * See subclasses that narrow this base down to a specific metric format.
 */
export default abstract class Metric<RecordFormat extends MetricRecord> {
  // TODO:
  readonly id: string;

  readonly tenantId: TenantId;

  // data properties
  protected dataTransformer: (d: RawMetricData) => RecordFormat[];

  protected readonly sourceFileName: string;

  isLoading?: boolean;

  protected allRecords?: RecordFormat[];

  error?: Error;

  constructor({
    tenantId,
    sourceFileName,
    dataTransformer,
  }: MetricProps<RecordFormat>) {
    makeObservable<Metric<RecordFormat>, "allRecords">(this, {
      allRecords: observable.ref,
      error: observable,
      isLoading: observable,
      records: computed,
    });

    // initialize data fetching
    this.tenantId = tenantId;
    this.sourceFileName = sourceFileName;
    this.dataTransformer = dataTransformer;
  }

  /**
   * Fetches the metric data from the server and transforms it.
   */
  protected async fetchAndTransform(): Promise<RecordFormat[]> {
    return fetchAndTransformMetric({
      sourceFileName: this.sourceFileName,
      tenantId: this.tenantId,
      transformFn: this.dataTransformer,
    });
  }

  /**
   * Fetches metric data and stores the result reactively on this Metric instance.
   */
  async populateAllRecords(): Promise<void> {
    this.isLoading = true;
    try {
      const fetchedData = await this.fetchAndTransform();
      runInAction(() => {
        this.allRecords = fetchedData;
        this.isLoading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.isLoading = false;
        this.error = e;
      });
    }
  }

  /**
   * Returns fetched, transformed, and (optionally) filtered data for this metric.
   * Will automatically initiate a fetch if necessary.
   */
  protected getOrFetchRecords(): RecordFormat[] | undefined {
    if (this.allRecords) return this.allRecords;
    if (!this.isLoading || !this.error) this.populateAllRecords();
    return undefined;
  }

  get records(): RecordFormat[] | undefined {
    return this.getOrFetchRecords();
  }

  get recordsUnfiltered(): RecordFormat[] | undefined {
    return this.allRecords;
  }
}
