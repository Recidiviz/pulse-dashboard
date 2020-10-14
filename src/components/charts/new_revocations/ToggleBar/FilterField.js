// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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
import PropTypes from "prop-types";
import cn from "classnames";

import useTopBarShrinking from "../../../../hooks/useTopBarShrinking";
import { toHtmlFriendly } from "../../../../utils/transforms/labels";

const FilterField = ({ label, children }) => {
  const isTopBarShrinking = useTopBarShrinking();
  const topLevelFilterClassName = isTopBarShrinking
    ? "top-level-filter top-level-active d-f align-items-center"
    : "top-level-filter";
  const titleLevelClassName = isTopBarShrinking
    ? "title-level top-level-filters-title"
    : "title-level";

  return (
    <div
      className={cn(
        "FilterField",
        `FilterField--${toHtmlFriendly(label).toLowerCase()}`,
        topLevelFilterClassName
      )}
    >
      <h4 className={titleLevelClassName}>{label}</h4>
      {children}
    </div>
  );
};

FilterField.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default FilterField;
