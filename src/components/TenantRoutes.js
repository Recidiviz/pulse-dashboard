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
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

import Loading from "./Loading";
import { useAuth0 } from "../react-auth0-spa";
import { doesUserHaveAccess } from "../utils/authentication/user";
import NotFound from "../views/NotFound";
import { useRootStore } from "../StoreProvider";

const TenantRoutes = ({ children }) => {
  const { currentTenantId } = useRootStore();
  const { user, loading, isAuthenticated, loginWithRedirect } = useAuth0();
  const { pathname } = useLocation();
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

  if (!isAuthenticated || !user || !currentTenantId) {
    return null;
  }

  return Children.toArray(children).reduce((node, child) => {
    const { tenantIds } = child.props;
    if (
      doesUserHaveAccess(user, currentTenantId) &&
      tenantIds.includes(currentTenantId)
    ) {
      return child;
    }

    return node;
  }, <NotFound />);
};

TenantRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TenantRoutes;
