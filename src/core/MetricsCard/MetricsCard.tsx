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
import { Card, CardSection, H4 } from "@recidiviz/case-triage-components";

const MetricsCardComponent = styled(Card)`
  width: 100%;
  margin: 1rem;
`;

const MetricSubHeading = styled.div`
  font-size: 0.9rem;
  line-height: 1.5;
`;

const HeadingContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 25px 40px;
  height: 64px;
`;

interface MetricsCardProps {
  heading: string;
  subheading?: string;
  children: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  heading,
  subheading,
  children,
}) => {
  return (
    <MetricsCardComponent stacked>
      <CardSection>
        <HeadingContainer>
          <H4>{heading}</H4>
          {subheading && <MetricSubHeading>{subheading}</MetricSubHeading>}
        </HeadingContainer>
      </CardSection>
      {children}
    </MetricsCardComponent>
  );
};

export default MetricsCard;
