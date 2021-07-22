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

import { when } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";

import Loading from "../components/Loading";
import NotFound from "../components/NotFound";
import { useRootStore } from "../components/StoreProvider";
import { ERROR_MESSAGES } from "../constants";

/**
 * Verifies authorization before rendering its children.
 */
const AuthWall: React.FC = ({ children }) => {
  const { userStore, currentTenantId } = useRootStore();
  const { userAppMetadata } = userStore;

  useEffect(
    () =>
      // return when's disposer so it is cleaned up if it never runs
      when(
        () => !userStore.isAuthorized,
        () => userStore.authorize()
      ),
    [userStore]
  );

  if (userStore.authError) {
    throw userStore.authError;
  }

  if (userStore.userIsLoading) {
    return <Loading />;
  }
  if (userStore.isAuthorized) {
    if (
      userAppMetadata.can_access_leadership_dashboard !== undefined &&
      !userAppMetadata.can_access_leadership_dashboard
    ) {
      if (
        userAppMetadata.can_access_case_triage !== undefined &&
        userAppMetadata.can_access_case_triage
      ) {
        window.location.href =
          process.env.REACT_APP_CASE_TRIAGE_URL || "about:blank";
        return <Loading />;
      }

      userStore.setAuthError(ERROR_MESSAGES.unauthorized);
    }
    const authorizedChildren = React.Children.map(children, (child: any) => {
      const { tenantIds } = child.props;
      return tenantIds.includes(currentTenantId) ? child : null;
    });

    return authorizedChildren && authorizedChildren.length > 0 ? (
      <>{authorizedChildren}</>
    ) : (
      <NotFound />
    );
  }

  return null;
};

export default observer(AuthWall);
