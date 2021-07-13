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
import "./PopulationSummaryMetrics.scss";

import { observer } from "mobx-react-lite";
import React from "react";

import { useFiltersStore } from "../CoreStoreProvider";
import MetricsCard from "../MetricsCard/MetricsCard";
import type { ProjectedSummaryRecord } from "../models/types";
import SummaryMetrics from "./SummaryMetrics";

const ProjectedSummaryMetrics: React.FC<{
  data?: ProjectedSummaryRecord;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  const { timePeriodLabel } = useFiltersStore();

  return (
    <MetricsCard heading={`Next ${timePeriodLabel}`} subheading="Projected">
      {!data && !isLoading ? (
        <div className="MissingProjectionData">
          There are not enough data to generate a projection for this subset of
          the population.
        </div>
      ) : (
        <SummaryMetrics isLoading={isLoading} data={data} showMinMax />
      )}
    </MetricsCard>
  );
};

export default observer(ProjectedSummaryMetrics);
