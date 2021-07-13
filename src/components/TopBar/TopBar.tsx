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

import cn from "classnames";
import React from "react";

import { useRootStore } from "../StoreProvider";

interface Props {
  children: JSX.Element[];
  isHidable: boolean;
  isWide: boolean;
}

const TopBar: React.FC<Props> = ({
  isHidable = false,
  isWide = false,
  children,
}) => {
  const { pageStore } = useRootStore();

  return (
    <div
      className={cn("TopBar", "header", "navbar", {
        "TopBar--wide": isWide,
        "TopBar--hidden": pageStore.hideTopBar && isHidable,
      })}
    >
      <div className="TopBar__container header-container">{children}</div>
    </div>
  );
};

export default TopBar;
