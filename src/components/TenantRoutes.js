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
import { useStateCode } from "../contexts/StateCodeContext";
import { doesUserHaveAccess } from "../utils/authentication/user";
import NotFound from "../views/NotFound";

const TenantRoutes = ({ children }) => {
  const { user, loading, isAuthenticated, loginWithRedirect } = useAuth0();
  const { pathname } = useLocation();
  const { currentStateCode, refreshCurrentStateCode } = useStateCode();

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

  useEffect(() => {
    if (user) {
      refreshCurrentStateCode();
    }
  }, [refreshCurrentStateCode, isAuthenticated, user]);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated || !user || !currentStateCode) {
    return null;
  }

  let element = null;

  Children.forEach(children, (child) => {
    const { stateCode } = child.props;

    if (doesUserHaveAccess(user, stateCode) && stateCode === currentStateCode) {
      element = child;
    }
  });

  if (element === null) {
    return <NotFound />;
  }

  return element;
};

TenantRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TenantRoutes;
