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
import { runInAction } from "mobx";
import CoreStore from "../../CoreStore";
import FiltersStore from "../../CoreStore/FiltersStore";
import { callMetricsApi } from "../../../api/metrics/metricsClient";
import RootStore from "../../../RootStore";
import ProjectionsMetrics from "../ProjectionsMetrics";
import { CORE_VIEWS } from "../../views";

const mockTenantId = "US_ND";
const mockGetTokenSilently = jest.fn();
const mockCoreStore = {} as CoreStore;
const filtersStore = new FiltersStore({ rootStore: mockCoreStore });
jest
  .spyOn(RootStore, "getTokenSilently", "get")
  .mockReturnValue(mockGetTokenSilently);
jest.mock("../../../api/metrics/metricsClient", () => {
  return {
    callMetricsApi: jest.fn().mockResolvedValue({
      population_projection_summaries: [
        {
          admission_count: "400",
          admission_percent_change: "-5.5",
          compartment: "INCARCERATION",
          legal_status: "PROBATION",
          metric_period_months: "6",
          population_percent_change: "-12",
          release_count: "700",
          release_percent_change: "7",
          simulation_date: "2021-02-02",
          simulation_group: "MALE",
          simulation_tag: "HISTORICAL",
          state_code: "US_ID",
          total_population: "13000",
        },
        {
          admission_count: "2100",
          admission_count_max: "2400",
          admission_count_min: "1800",
          admission_percent_change: "-2.8",
          compartment: "INCARCERATION",
          legal_status: "PROBATION",
          metric_period_months: "36",
          population_percent_change: "-13.1",
          release_count: "5500",
          release_count_max: "6000",
          release_count_min: "5000",
          release_percent_change: "10",
          simulation_date: "2021-02-02",
          simulation_group: "MALE",
          simulation_tag: "POLICY_A",
          state_code: "US_ID",
          total_population: "13000",
          total_population_count_max: "13540",
          total_population_count_min: "12460",
        },
      ],
      population_projection_timeseries: [
        {
          compartment: "INCARCERATION",
          gender: "MALE",
          legal_status: "ALL",
          month: "5",
          simulation_tag: "HISTORICAL",
          state_code: "US_ID",
          total_population: 7641,
          total_population_max: 7641,
          total_population_min: 7641,
          year: "2016",
        },
        {
          compartment: "SUPERVISION",
          gender: "ALL",
          legal_status: "ALL",
          month: "1",
          simulation_tag: "HISTORICAL",
          state_code: "US_ID",
          total_population: 7641,
          total_population_max: 7641,
          total_population_min: 7641,
          year: "2016",
        },
        {
          compartment: "INCARCERATION",
          gender: "ALL",
          legal_status: "ALL",
          month: "12",
          simulation_tag: "HISTORICAL",
          state_code: "US_ID",
          total_population: 7641,
          total_population_max: 7641,
          total_population_min: 7641,
          year: "2015",
        },
      ],
    }),
  };
});

describe("ProjectionsMetrics", () => {
  let metric: ProjectionsMetrics;

  beforeEach(() => {
    metric = new ProjectionsMetrics({
      tenantId: mockTenantId,
      sourceEndpoint: "vitals",
    });
  });

  it("fetches metrics when initialized", () => {
    expect(callMetricsApi).toHaveBeenCalledWith(
      `${mockTenantId.toLowerCase()}/vitals`,
      mockGetTokenSilently
    );
  });

  it("sets apiData to the resolved fetched value", () => {
    expect(metric.apiData).toHaveProperty("population_projection_summaries");
    expect(metric.apiData).toHaveProperty("population_projection_timeseries");
  });

  it("sets isLoading to false", () => {
    expect(metric.isLoading).toEqual(false);
  });

  it("has a transformed summaries property", () => {
    expect(metric.summaries).toEqual([
      {
        admissionCount: 400,
        admissionPercentChange: -5.5,
        compartment: "INCARCERATION",
        gender: "MALE",
        legalStatus: "PROBATION",
        populationPercentChange: -12,
        releaseCount: 700,
        releasePercentChange: 7,
        simulationTag: "HISTORICAL",
        timePeriod: "6",
        totalPopulation: 13000,
      },
      {
        admissionCount: 2100,
        admissionCountMax: 2400,
        admissionCountMin: 1800,
        admissionPercentChange: -2.8,
        compartment: "INCARCERATION",
        gender: "MALE",
        legalStatus: "PROBATION",
        populationPercentChange: -13.1,
        releaseCount: 5500,
        releaseCountMax: 6000,
        releaseCountMin: 5000,
        releasePercentChange: 10,
        simulationTag: "POLICY_A",
        timePeriod: "36",
        totalPopulation: 13000,
        totalPopulationCountMax: 13540,
        totalPopulationCountMin: 12460,
      },
    ]);
  });

  it("has a transformed timeSeries property", () => {
    expect(metric.timeSeries).toContainEqual({
      compartment: "SUPERVISION",
      gender: "ALL",
      legalStatus: "ALL",
      month: 1,
      simulationTag: "HISTORICAL",
      totalPopulation: 7641,
      totalPopulationMax: 7641,
      totalPopulationMin: 7641,
      year: 2016,
    });
  });

  it("sorts timeseries records in ASC order", () => {
    expect(
      metric.timeSeries.map((record) => ({
        month: record.month,
        year: record.year,
      }))
    ).toEqual([
      { month: 12, year: 2015 },
      { month: 1, year: 2016 },
      { month: 5, year: 2016 },
    ]);
  });

  it("finds the simulation month", () => {
    expect(metric.simulationDate).toEqual(new Date(2016, 4));
  });

  it("does not throw when accessing the simluation date without loaded data", () => {
    jest.mock("../../../api/metrics/metricsClient", () => {
      return {
        callMetricsApi: jest.fn().mockResolvedValue({
          population_projection_summaries: [],
        }),
      };
    });

    metric = new ProjectionsMetrics({
      tenantId: mockTenantId,
      sourceEndpoint: "vitals",
    });

    expect(metric.simulationDate).toEqual(new Date(9999, 11, 31));
  });

  describe("getFilteredDataByView", () => {
    beforeEach(() => {
      mockCoreStore.filtersStore = filtersStore;
      metric = new ProjectionsMetrics({
        tenantId: mockTenantId,
        sourceEndpoint: "vitals",
        rootStore: mockCoreStore,
      });
    });

    it("returns facilities time series on the facilities view", () => {
      const filteredData = metric.getFilteredDataByView(CORE_VIEWS.facilities);
      expect(
        filteredData
          .map((d) => d.compartment)
          .every((d) => d === "INCARCERATION")
      ).toBeTrue();
    });

    it("returns community time series on the community view", () => {
      const filteredData = metric.getFilteredDataByView(CORE_VIEWS.community);
      expect(
        filteredData.map((d) => d.compartment).every((d) => d === "SUPERVISION")
      ).toBeTrue();
    });
  });

  describe("filterTimeSeriesData", () => {
    beforeEach(() => {
      mockCoreStore.filtersStore = filtersStore;

      metric = new ProjectionsMetrics({
        tenantId: mockTenantId,
        sourceEndpoint: "vitals",
        rootStore: mockCoreStore,
      });
    });

    it("filters by default values", () => {
      expect(metric.filteredFacilitiesTimeSeries).toEqual([
        {
          compartment: "INCARCERATION",
          gender: "ALL",
          legalStatus: "ALL",
          month: 12,
          simulationTag: "HISTORICAL",
          totalPopulation: 7641,
          totalPopulationMax: 7641,
          totalPopulationMin: 7641,
          year: 2015,
        },
      ]);
      expect(metric.filteredCommunityTimeSeries).toEqual([
        {
          compartment: "SUPERVISION",
          gender: "ALL",
          legalStatus: "ALL",
          month: 1,
          simulationTag: "HISTORICAL",
          totalPopulation: 7641,
          totalPopulationMax: 7641,
          totalPopulationMin: 7641,
          year: 2016,
        },
      ]);
    });

    it("updates when the filters change", () => {
      runInAction(() => {
        if (metric.rootStore) {
          metric.rootStore.filtersStore.setFilters({ gender: "MALE" });
        }

        expect(metric.filteredFacilitiesTimeSeries).toEqual([
          {
            compartment: "INCARCERATION",
            gender: "MALE",
            legalStatus: "ALL",
            month: 5,
            simulationTag: "HISTORICAL",
            totalPopulation: 7641,
            totalPopulationMax: 7641,
            totalPopulationMin: 7641,
            year: 2016,
          },
        ]);
      });
    });
  });
});
