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

function SortableIcon({ order = null }) {
  switch (order) {
    case "asc":
      return <i className="fa fa-sort-up" />;
    case "desc":
      return <i className="fa fa-sort-down" />;
    default:
      return <i className="fa fa-unsorted op-50p" />;
  }
}

const orderPropType = PropTypes.oneOf(["asc", "desc"]);

SortableIcon.propTypes = {
  order: orderPropType,
};

SortableIcon.defaultProps = {
  order: null,
};

const Sortable = ({ children, order = null, onClick }) => (
  <button
    className="Sortable"
    type="button"
    style={{ cursor: "pointer", userSelect: "none", textAlign: "left" }}
    onClick={onClick}
  >
    {children}
    &nbsp;
    <SortableIcon order={order} />
  </button>
);

Sortable.defaultProps = {
  order: null,
};

Sortable.propTypes = {
  children: PropTypes.node.isRequired,
  order: orderPropType,
  onClick: PropTypes.func.isRequired,
};

export default Sortable;
