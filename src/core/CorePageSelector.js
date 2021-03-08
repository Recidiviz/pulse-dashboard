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
import { Link } from "react-router-dom";
import cx from "classnames";

import "./CorePageSelector.scss";

const CorePageSelector = ({ currentSection, currentPage, pageOptions }) => {
  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <ul className="CorePageSelector">
      {pageOptions.map((page) => (
        <li key={page}>
          <Link
            to={`/${currentSection}/${page}`}
            className={cx("CorePageSelector--Option", {
              "CorePageSelector--Option-Selected":
                currentPage.toLowerCase() === page,
            })}
          >
            {capitalizeFirstLetter(page)}
          </Link>
        </li>
      ))}
    </ul>
  );
};

CorePageSelector.propTypes = {
  currentSection: PropTypes.string.isRequired,
  currentPage: PropTypes.string.isRequired,
  pageOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CorePageSelector;
