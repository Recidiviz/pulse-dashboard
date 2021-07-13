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
import { observer } from "mobx-react-lite";
import React from "react";
import { Redirect } from "react-router-dom";

import { useRootStore } from "./components/StoreProvider";
import tenants from "./tenants";
import { getPathsFromNavigation } from "./utils/navigation";

export const RedirectHome: React.FC = ({ ...rest }) => {
  const rootStore = useRootStore();
  // @ts-ignore
  const tenant = tenants[rootStore.currentTenantId];
  const allowedPaths = getPathsFromNavigation(tenant.navigation);
  return <Redirect {...rest} exact from="/" to={allowedPaths[0]} />;
};

export default observer(RedirectHome);
