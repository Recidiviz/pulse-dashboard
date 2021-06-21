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

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

type propTypes = {
  menu: { label: string; link: string }[];
  onClick: (link: string) => void;
};

const CoreSectionSelector: React.FC<propTypes> = ({ menu, onClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const currentPath = useLocation().pathname;
  const currentLabel = currentPath.split("/")[1];
  const selectedItem =
    menu.find((item) => item.label.toLowerCase() === currentLabel) ?? menu[0];
  const filteredMenu = menu.filter((item) => item.label !== selectedItem.label);

  // TODO(#919): Return keyboard control to section selector
  return (
    <Dropdown
      className="CoreSectionSelector"
      isOpen={dropdownOpen}
      toggle={toggle}
    >
      <DropdownToggle
        className="CoreSectionSelector__toggle dropdown-toggle"
        tag="span"
      >
        {selectedItem.label}
      </DropdownToggle>
      <DropdownMenu
        className="CoreSectionSelector__menu"
        cssModule={{ transform: "translate3d(0px, 24px, 0px)" }}
      >
        {filteredMenu.map(({ label, link }) => (
          <Link key={label} to={link} onClick={() => onClick(link)}>
            <DropdownItem className="CoreSectionSelector__item" tag="button">
              {label}
            </DropdownItem>
          </Link>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default React.memo(CoreSectionSelector);
