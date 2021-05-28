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
import { MetricType } from "../PageVitals/types";
import { useCoreStore } from "../CoreStoreProvider";

const VitalsSummaryCards: React.FC = () => {
  const { vitalsPageStore } = useCoreStore();
  const { summaryCards, selectedMetricId } = vitalsPageStore;
  const handleSelectCard: (id: MetricType) => () => void = (id) => () => {
    vitalsPageStore.setSelectedMetricId(id);
  };

  return (
    <>
      {summaryCards.map(({ title, value, status, id }) => (
        <VitalsSummaryCard
          key={id}
          id={id}
          title={title}
          percentage={value}
          status={status}
          selected={selectedMetricId === id}
          onClick={handleSelectCard(id)}
        />
      ))}
    </>
  );
};

export default VitalsSummaryCards;
