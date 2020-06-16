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

import React, { Children, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Loading from "./Loading";
import { useAuth0 } from "../react-auth0-spa";
import { useAdminStateCode } from "../contexts/AdminStateCodeContext";
import { isUserHasAccess } from "../views/stateViews";
import NotFound from "../views/NotFound";
import { isAdminUser } from "../utils/authentication/user";

const TenantRoutes = ({ children }) => {
  const { user, loading, isAuthenticated, loginWithRedirect } = useAuth0();
  const { pathname } = useLocation();
  const { adminStateCode } = useAdminStateCode();

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated && !loading) {
        await loginWithRedirect({
          appState: { targetUrl: pathname },
        });
      }
    };
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading]);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  let element = null;

  Children.forEach(children, (child) => {
    const hasAccess = isUserHasAccess(user, child.props.stateCode);

    if (isAdminUser(user)) {
      if (hasAccess && adminStateCode === child.props.stateCode) {
        element = child;
      }
    } else if (hasAccess) {
      element = child;
    }
  });

  if (element === null) {
    return <NotFound />;
  }

  return element;
};

export default TenantRoutes;
