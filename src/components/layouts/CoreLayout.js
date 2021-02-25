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

import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import TopBar from "../topbar/TopBar";
import TopBarDropdown from "../topbar/TopBarDropdown";
import TopBarUserMenuForAuthenticatedUser from "../topbar/TopBarUserMenuForAuthenticatedUser";
import Footer from "../Footer";

import "./CoreLayout.scss";

const selectOptions = [
  {
    value: "Community",
    label: "Community",
    defaultPath: "/community",
    pages: {
      goals: "goals",
      explore: "explore",
    },
  },
  {
    value: "Facilities",
    label: "Facilities",
    defaultPath: "/facilities",
    pages: {
      goals: "goals",
      explore: "explore",
    },
  },
  {
    value: "Programming",
    label: "Programming",
    defaultPath: "/programming",
    pages: {
      explore: "explore",
    },
  },
];

const CoreLayout = ({ children }) => {
  const history = useHistory();
  const { pathname } = useLocation();

  const getSelectedOption =
    selectOptions.find((item) => pathname.includes(item.value.toLowerCase())) ??
    selectOptions[0];

  const [activeOption, setActiveOption] = useState(getSelectedOption);

  const routeOnClick = useCallback(
    (path) => {
      history.push(path);
    },
    [history]
  );

  useEffect(() => {
    setActiveOption(getSelectedOption);
  }, [getSelectedOption, pathname]);

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <div id="app">
      <div className="page-container">
        <TopBar>
          <div className="CoreHeader">
            <ul className="nav-left">
              <TopBarDropdown />
            </ul>
            <ul className="nav-right">
              <ul className="page-toggle">
                {Object.keys(activeOption.pages).map((option) => {
                  const key = activeOption.defaultPath + option;
                  const pagePath = `${activeOption.defaultPath}/${option}`;
                  return (
                    <li key={key}>
                      <input
                        type="checkbox"
                        className="visually-hidden"
                        id={key}
                        name="page"
                        checked={pathname === pagePath}
                        onClick={() => routeOnClick(pagePath)}
                      />
                      <label className="page-label" htmlFor={key}>
                        {capitalizeFirstLetter(activeOption.pages[option])}
                      </label>
                    </li>
                  );
                })}
              </ul>
              <TopBarUserMenuForAuthenticatedUser />
            </ul>
          </div>
        </TopBar>
        {children}

      <Footer />
    </div>
  );
};

CoreLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

export default CoreLayout;
