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
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import * as Sentry from "@sentry/react";
import ErrorMessage from "./ErrorMessage";
import { useRootStore } from "../StoreProvider";

function ErrorBoundary({ children }) {
  const { restrictedDistrict, currentTenantId, filters } = useRootStore();

  const handleBeforeCapture = (scope) => {
    if (currentTenantId) scope.setTag("currentTenantId", currentTenantId);
    if (restrictedDistrict) {
      scope.setTag("restrictedDistrict", restrictedDistrict);
    }
    if (filters) {
      const parsedFilters = Object.fromEntries(toJS(filters));
      scope.setContext("filters", parsedFilters);
    }
  };

  return (
    <Sentry.ErrorBoundary
      fallback={({ error }) => <ErrorMessage error={error} />}
      beforeCapture={handleBeforeCapture}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

ErrorBoundary.propTypes = {
  children: PropTypes.element.isRequired,
};

export default observer(ErrorBoundary);
