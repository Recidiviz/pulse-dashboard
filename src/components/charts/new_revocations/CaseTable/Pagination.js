// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

const Pagination = ({ beginning, end, total, createUpdatePage }) => {
  const start = beginning + 1;

  const range = start !== end ? `${start}-${end}` : beginning + 1;

  return (
    <div className="Pagination fs-block">
      {beginning !== 0 && (
        <button type="button" onClick={createUpdatePage(-1)}>
          &#10094;
        </button>
      )}
      <span>{`Showing ${range} of ${total}`}</span>
      {end < total && (
        <button type="button" onClick={createUpdatePage(1)}>
          &#10095;
        </button>
      )}
    </div>
  );
};

Pagination.propTypes = {
  beginning: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  createUpdatePage: PropTypes.func.isRequired,
};

export default Pagination;
