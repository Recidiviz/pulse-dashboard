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

import { autorun, makeObservable, observable, runInAction } from "mobx";
import { callMetricsApi } from "../../api/metrics/metricsClient";
import { RawMetricData, MetricRecord, TenantId } from "./types";
import rootStore from "../../RootStore";

export type BaseMetricProps = {
  tenantId: TenantId;
  sourceEndpoint: string;
};

/**
 * Represents a single dataset backed by our metrics API. This is an abstract
 * class and should not be directly instantiated.
 */
export default abstract class Metric<RecordFormat extends MetricRecord> {
  readonly tenantId: TenantId;

  protected readonly sourceEndpoint: string;

  isLoading = true;

  isError?: Error;

  apiData?: Record<string, RawMetricData>;

  constructor({ tenantId, sourceEndpoint }: BaseMetricProps) {
    makeObservable<Metric<RecordFormat>>(this, {
      isError: observable,
      isLoading: observable,
      apiData: observable.ref,
    });

    this.tenantId = tenantId;
    this.sourceEndpoint = sourceEndpoint;

    autorun(() => {
      if (this.tenantId) this.hydrate();
    });
  }

  /**
   * Fetches the metric data from the server and transforms it.
   */
  protected async fetchMetrics(): Promise<Record<string, RawMetricData>> {
    const endpoint = `${this.tenantId}/${this.sourceEndpoint}`.toLowerCase();
    return callMetricsApi(endpoint, rootStore.getTokenSilently);
  }

  /**
   * Fetches metric data and stores the result reactively on this Metric instance.
   */
  async hydrate(): Promise<void> {
    try {
      const fetchedData = await this.fetchMetrics();
      runInAction(() => {
        this.isLoading = true;
        this.apiData = fetchedData;
        this.isLoading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.isLoading = false;
        this.isError = e;
      });
    }
  }
}
