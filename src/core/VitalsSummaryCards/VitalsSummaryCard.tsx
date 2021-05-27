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
import cn from "classnames";
import { SummaryStatus } from "../models/types";
import { formatPercent } from "../../utils/formatStrings";
import "./VitalsSummaryCard.scss";

const getStatusClassName = (status: SummaryStatus) => {
  switch (status) {
    case "NEEDS_IMPROVEMENT":
      return "VitalsSummaryCard__needs-improvement";
    case "POOR":
      return "VitalsSummaryCard__poor";
    case "GOOD":
      return "VitalsSummaryCard__good";
    case "GREAT":
      return "VitalsSummaryCard__great";
    case "EXCELLENT":
      return "VitalsSummaryCard__excellent";

    default:
      return "";
  }
};

interface PropTypes {
  id: string;
  title: string;
  percentage: number;
  status: SummaryStatus;
  selected: boolean;
  onClick: () => void;
}

const VitalsSummaryCard: React.FC<PropTypes> = ({
  id,
  title,
  percentage,
  status,
  selected,
  onClick,
}) => (
  <div
    role="presentation"
    onKeyDown={onClick}
    onClick={onClick}
    className={cn(
      "VitalsSummaryCard",
      `VitalsSummaryCard__${id}`,
      { selected },
      getStatusClassName(status),
      "p-0"
    )}
  >
    <div
      className={`${cn(getStatusClassName(status))}__top-border top-border`}
    />
    <div className={`${cn(getStatusClassName(status))}__content content p-0`}>
      <div className="VitalsSummaryCard__title">
        <span>{title}</span>
      </div>
      <div
        className={`VitalsSummaryCard__percent ${cn(
          getStatusClassName(status)
        )}__percent`}
      >
        <span>{formatPercent(percentage)}</span>
      </div>
    </div>
  </div>
);
VitalsSummaryCard.defaultProps = {
  selected: false,
};

export default VitalsSummaryCard;
