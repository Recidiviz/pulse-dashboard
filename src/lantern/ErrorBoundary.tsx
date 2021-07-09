// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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

import type Sentry from "@sentry/react";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";

import SentryErrorBoundary from "../components/SentryErrorBoundary";
import { useLanternStore } from "./LanternStoreProvider";

interface Props {
  children: React.ReactElement;
}

function ErrorBoundary({ children }: Props): React.ReactElement {
  const {
    userRestrictionsStore: { allowedSupervisionLocationIds },
    currentTenantId,
    filters,
  } = useLanternStore();

  const handleBeforeCapture = (scope: Sentry.Scope) => {
    if (currentTenantId) scope.setTag("currentTenantId", currentTenantId);
    if (allowedSupervisionLocationIds.length) {
      scope.setTag(
        "allowedSupervisionLocationIds",
        allowedSupervisionLocationIds.join(",")
      );
    }
    if (filters) {
      const parsedFilters = Object.fromEntries(toJS(filters));
      scope.setContext("filters", parsedFilters);
    }
  };

  return (
    <SentryErrorBoundary handleBeforeCapture={handleBeforeCapture}>
      {children}
    </SentryErrorBoundary>
  );
}

export default observer(ErrorBoundary);
