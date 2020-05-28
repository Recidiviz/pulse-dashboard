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
import { useLocation } from "react-router-dom";

const SideBarGroup = ({ children, icon, name, url }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(url);
  const className = isActive ? "sidebar-group active" : "sidebar-group";

  return (
    <li className="nav-item">
      <div className={className}>
        <span className="icon-holder">{icon}</span>
        <span className="title">{name}</span>
      </div>
      <ul className="pos-r">{children}</ul>
    </li>
  );
};

SideBarGroup.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default SideBarGroup;
