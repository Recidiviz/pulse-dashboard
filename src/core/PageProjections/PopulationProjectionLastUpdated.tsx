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
import { PopulationProjectionTimeSeriesRecord } from "../models/types";
import "./PopulationProjectionLastUpdated.scss";

type Props = {
  projectionTimeSeries: PopulationProjectionTimeSeriesRecord[];
};

const PopulationProjectionLastUpdated: React.FC<Props> = ({
  projectionTimeSeries,
}) => {
  // Filter records
  const { year, month } = projectionTimeSeries
    .filter((d) => d.simulationTag === "HISTORICAL")
    .sort((a, b) => (a.year === b.year ? a.month - b.month : a.year - b.year))
    .slice(-1)[0];

  const simulationDate = new Date(year, month - 1, 1);

  return (
    <div className="PopulationProjectionLastUpdated">
      Historical and projected population data were generated{" "}
      {simulationDate.toLocaleString("default", { month: "long" })} {year}.
    </div>
  );
};

export default PopulationProjectionLastUpdated;
