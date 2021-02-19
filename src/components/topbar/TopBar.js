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

import { usePageState } from "../../contexts/PageContext";

const TopBar = ({ children, isHidable = false, isWide = false }) => {
  const { hideTopBar } = usePageState();

  return (
    <div
      className={cn("TopBar", "header", "navbar", {
        "TopBar--wide": isWide,
        "TopBar--hidden": hideTopBar && isHidable,
      })}
    >
      <div className="TopBar__container header-container">{children}</div>
    </div>
  );
};

TopBar.defaultProps = {
  isHidable: false,
  isWide: false,
};

TopBar.propTypes = {
  children: PropTypes.node.isRequired,
  isHidable: PropTypes.bool,
  isWide: PropTypes.bool,
};

export default TopBar;
