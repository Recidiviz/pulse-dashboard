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
import styled from "styled-components/macro";
import { Icon, IconSVG } from "@recidiviz/case-triage-components";
import { formatLargeNumber } from "../../utils/labels";

const MetricContainer = styled.div`
  display: flex;
  flex-flow: column;
  padding: 20px 40px;
  width: 30%;
`;

const Value = styled.div`
  padding: 4px;
`;

// TODO: Use typography components from component library
export const MetricTitle = styled.div`
  font-family: "Libre Franklin";
  font-size: 0.9rem;
  line-height: 1rem;
  font-weight: 500;
  color: rgba(53, 83, 98, 0.85);
  white-space: nowrap;
`;
const MetricValue = styled.div`
  font-family: "Libre Baskerville";
  font-size: 2rem;
  line-height: 40px;
  font-weight: 400;
  color: #00413e;
`;
const MetricDelta = styled.div<{ color: string }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ color }) => color};
  font-family: "Libre Franklin";
  font-size: 0.9rem;
  line-height: 16px;
  font-weight: 500;
`;
const MetricMinMax = styled.div`
  font-family: "Libre Franklin";
  font-size: 0.9rem;
  line-height: 1rem;
  font-weight: 400;
  color: rgba(53, 83, 98, 0.85);
  white-space: nowrap;
`;

interface SummaryMetricProps {
  title: string;
  value: number;
  percentChange: number;
  deltaDirection: deltaDirections;
  projectedMinMax?: number[] | null;
}

// TODO: Do we need a "same" or "no change" display color?
type deltaDirections = "improved" | "worsened";

const deltaColorMap: { [key in deltaDirections]: string } = {
  improved: "#207E7A",
  worsened: "#A43939",
};

function formatPercent(percentage: number): string {
  return `${percentage}%`;
}

// TODO case-triage#69 Add a rotation prop for caret icon
const SummaryMetric: React.FC<SummaryMetricProps> = ({
  title,
  value,
  percentChange,
  deltaDirection,
  projectedMinMax = null,
}) => {
  return (
    <MetricContainer>
      <MetricTitle>{title}</MetricTitle>
      <MetricValue>
        <Value>{formatLargeNumber(value)}</Value>
      </MetricValue>
      <MetricDelta color={deltaColorMap[deltaDirection]}>
        <Icon
          kind={IconSVG.Caret}
          width={12}
          height={10}
          fill={deltaColorMap[deltaDirection]}
        />
        <Value>{formatPercent(percentChange)}</Value>
      </MetricDelta>
      {projectedMinMax && (
        <MetricMinMax>
          <Value>({projectedMinMax.map(formatLargeNumber).join(", ")})</Value>
        </MetricMinMax>
      )}
    </MetricContainer>
  );
};
export default SummaryMetric;
