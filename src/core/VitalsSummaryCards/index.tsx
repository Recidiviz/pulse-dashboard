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

import VitalsSummaryCard from "./VitalsSummaryCard";
import { SummaryCard, MetricType } from "../PageVitals/types";

type PropTypes = {
  summaryCards: SummaryCard[];
  selected: MetricType;
  onClick: (id: MetricType) => () => void;
};

const VitalsSummaryCards: React.FC<PropTypes> = ({
  summaryCards,
  selected,
  onClick,
}) => {
  return (
    <>
      {summaryCards.map(({ title, value, status, id }) => (
        <VitalsSummaryCard
          key={id}
          title={title}
          percentage={value}
          status={status}
          selected={selected === id}
          onClick={onClick(id)}
        />
      ))}
    </>
  );
};

export default VitalsSummaryCards;
