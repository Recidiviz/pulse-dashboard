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
import { Icon, IconSVG } from "@recidiviz/case-triage-components";
import { formatPercent } from "../../utils/formatStrings";
import * as styles from "../CoreConstants.scss";
import "./PercentDelta.scss";

const deltaDirections = {
  improved: "improved",
  worsened: "worsened",
  noChange: "noChange",
} as const;

const ROTATE_UP = 180;
const ROTATE_DOWN = 0;

const deltaColorMap: {
  [key in DeltaDirections]: string;
} = {
  improved: styles.signalLinks,
  worsened: styles.crimsonDark,
  noChange: styles.slate60,
} as const;

type DeltaDirections = keyof typeof deltaDirections;

function getDeltaDirection({
  value,
  improvesOnIncrease = false,
}: {
  value: number;
  improvesOnIncrease?: boolean;
}): { color: string; rotate: number; direction: DeltaDirections } {
  if (value === 0)
    return {
      direction: deltaDirections.noChange,
      color: deltaColorMap.noChange,
      rotate: ROTATE_DOWN,
    };
  if (improvesOnIncrease) {
    if (value > 0) {
      return {
        direction: deltaDirections.improved,
        color: deltaColorMap.improved,
        rotate: ROTATE_UP,
      };
    }
    return {
      direction: deltaDirections.worsened,
      color: deltaColorMap.worsened,
      rotate: ROTATE_DOWN,
    };
  }
  if (value > 0) {
    return {
      direction: deltaDirections.worsened,
      color: deltaColorMap.worsened,
      rotate: ROTATE_UP,
    };
  }
  return {
    direction: deltaDirections.improved,
    color: deltaColorMap.improved,
    rotate: ROTATE_DOWN,
  };
}

type PropTypes = {
  value: number;
  className?: string;
  width?: number;
  height?: number;
  improvesOnIncrease: boolean;
};

const PercentDelta: React.FC<PropTypes> = ({
  value,
  className = "",
  width = 12,
  height = 10,
  improvesOnIncrease = false,
}) => {
  const deltaDirection = getDeltaDirection({
    value,
    improvesOnIncrease,
  });

  return (
    <div
      className={cn("PercentDelta", className)}
      style={{ color: deltaDirection.color }}
    >
      {deltaDirection.direction !== deltaDirections.noChange && (
        <Icon
          kind={IconSVG.Caret}
          width={width}
          height={height}
          fill={deltaDirection.color}
          rotate={deltaDirection.rotate}
        />
      )}
      <div className="PercentDelta__value">{formatPercent(value)}</div>
    </div>
  );
};

export default PercentDelta;
