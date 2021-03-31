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
// TODO(recidiviz-data/issues/6185): Remove this component when
// admissions/releases are validated
import React from "react";
import styled from "styled-components/macro";

import { Card, CardSection } from "@recidiviz/case-triage-components";
import { observer } from "mobx-react-lite";
import { useLocation } from "react-router-dom";
import PercentDelta from "../controls/PercentDelta";
import {
  filterData,
  MonthOptions,
  CURRENT_YEAR,
  CURRENT_MONTH,
} from "../PopulationTimeseriesChart/helpers";
import { CORE_VIEWS, getViewFromPathname } from "../views";
import { formatLargeNumber } from "../../utils/labels";
import { usePopulationFiltersStore } from "../../components/StoreProvider";
import type {
  PopulationProjectionTimeseriesRecord,
  SimulationCompartment,
} from "../models/types";
import "./LoadingMetrics.scss";

import "./PopulationSummaryMetrics.scss";
import * as styles from "../CoreConstants.scss";

type PropTypes = {
  isLoading?: boolean;
  isError: boolean;
  projectionSummaries?: PopulationProjectionTimeseriesRecord[];
};

const MetricsCardComponent = styled(Card)`
  width: 100%;
  :first-child {
    margin-right: 1rem;
  }
`;

const TempMetric = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  padding: 20px 40px;
  justify-content: space-between;
  min-height: 120px;
  width 100%;
`;

const TempMetricTitle = styled.div`
  color: ${styles.pine1};
  font: ${styles.fontUiSans16};
  letter-spacing: -0.01em;

  .TempMetricTitle__subtitle {
    color: ${styles.slate80};
    font: ${styles.fontUiSans14};
  }
`;

const TempMetricValueContainer = styled.div`
  display: flex;
  flex-flow: column;
  margin-right: 1rem;
`;

const TempMetricValuesContainer = styled.div`
  display: flex;
  flex-flow: row;

  .ProjectedSummaryMetric__delta {
    padding-bottom: 1rem;
  }
`;
const TempMetricCard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <MetricsCardComponent>
      <CardSection>{children}</CardSection>
    </MetricsCardComponent>
  );
};

const TempPopulationSummaryMetrics: React.FC<PropTypes> = ({
  isError,
  isLoading = false,
  projectionSummaries = [],
}) => {
  const { pathname } = useLocation();

  const filtersStore = usePopulationFiltersStore();
  const { timePeriodLabel } = filtersStore;
  const { gender, supervisionType, legalStatus } = filtersStore.filters;
  const view = getViewFromPathname(pathname);

  const timePeriod: MonthOptions = parseInt(
    filtersStore.filters.timePeriod,
    10
  ) as MonthOptions;

  let compartment: SimulationCompartment;

  switch (view) {
    case CORE_VIEWS.community:
      compartment = "SUPERVISION";
      break;
    case CORE_VIEWS.facilities:
      compartment = "INCARCERATION";
      break;
    default:
      // TODO: Error state
      return <div />;
  }

  if (isError) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="PopulationSummaryMetrics">
        <TempMetricCard>
          <TempMetric>
            <TempMetricTitle>Past {timePeriodLabel}</TempMetricTitle>
            <TempMetricValuesContainer>
              <TempMetricValueContainer>
                <div className="LoadingMetrics__value" />
              </TempMetricValueContainer>
              <div className="LoadingMetrics__percent" />
            </TempMetricValuesContainer>
          </TempMetric>
        </TempMetricCard>
        <TempMetricCard>
          <TempMetric>
            <TempMetricTitle>
              Next {timePeriodLabel}
              <div className="TempMetricTitle__subtitle">Projected</div>
            </TempMetricTitle>
            <TempMetricValuesContainer>
              <TempMetricValueContainer>
                <div className="LoadingMetrics__value" />
                <div className="LoadingMetrics__minMax" />
              </TempMetricValueContainer>
              <div className="LoadingMetrics__percent" />
            </TempMetricValuesContainer>
          </TempMetric>
        </TempMetricCard>
      </div>
    );
  }

  const filteredData = filterData(
    timePeriod,
    gender,
    compartment,
    compartment === "SUPERVISION" ? supervisionType : legalStatus,
    projectionSummaries
  ).sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));

  const currentData = filteredData.find(
    (d) => d.year === CURRENT_YEAR && d.month === CURRENT_MONTH
  ) as PopulationProjectionTimeseriesRecord;

  const historicalData = filteredData[0];

  const projectedData = filteredData[filteredData.length - 1];

  const {
    totalPopulation: projectedPopulation,
    totalPopulationMin,
    totalPopulationMax,
  } = projectedData;

  const historicalPercentChange =
    ((currentData.totalPopulation - historicalData.totalPopulation) /
      historicalData.totalPopulation) *
    100;

  const projectedPercentChange =
    ((projectedPopulation - currentData.totalPopulation) /
      currentData.totalPopulation) *
    100;

  return (
    <div className="PopulationSummaryMetrics">
      <TempMetricCard>
        <TempMetric>
          <TempMetricTitle>Past {timePeriodLabel}</TempMetricTitle>
          <TempMetricValuesContainer>
            <TempMetricValueContainer>
              <div className="SummaryMetric__value">
                <div>{formatLargeNumber(currentData.totalPopulation)}</div>
              </div>
            </TempMetricValueContainer>
            <PercentDelta
              className="SummaryMetric__delta"
              value={historicalPercentChange}
              improvesOnIncrease={false}
            />
          </TempMetricValuesContainer>
        </TempMetric>
      </TempMetricCard>
      <TempMetricCard>
        <TempMetric>
          <TempMetricTitle>
            Next {timePeriodLabel}
            <div className="TempMetricTitle__subtitle">Projected</div>
          </TempMetricTitle>
          <TempMetricValuesContainer>
            <TempMetricValueContainer>
              <div className="SummaryMetric__value">
                <div>{formatLargeNumber(projectedPopulation)}</div>
              </div>
              <div className="SummaryMetric__min-max">
                <div>
                  (
                  {[totalPopulationMin, totalPopulationMax]
                    .map(formatLargeNumber)
                    .join(", ")}
                  )
                </div>
              </div>
            </TempMetricValueContainer>
            <PercentDelta
              className="ProjectedSummaryMetric__delta SummaryMetric__delta"
              value={projectedPercentChange}
              improvesOnIncrease={false}
            />
          </TempMetricValuesContainer>
        </TempMetric>
      </TempMetricCard>
    </div>
  );
};

export default observer(TempPopulationSummaryMetrics);
