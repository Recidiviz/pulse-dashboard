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

import { useParams } from "react-router-dom";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { ComponentType, useEffect } from "react";
import { useCoreStore } from "./core/CoreStoreProvider";
import { convertSlugToId } from "./utils/navigation";
import { DEFAULT_ENTITY_ID } from "./core/PageVitals/types";

type RouteParams = {
  entityId?: string;
};

type NormalizedParams = {
  entityId: string;
};

const normalizeRouteParams = (rawParams: RouteParams): NormalizedParams => {
  const { entityId } = rawParams;
  return {
    entityId: entityId ? convertSlugToId(entityId) : DEFAULT_ENTITY_ID,
  };
};

/**
 * A high-order component responsible for syncing relevant route parameters
 * to the appropriate store, so it can react to navigation.
 * Passes all props through `RouteComponent`, with route parameters normalized.
 */
const withRouteSync = <Props extends RouteParams>(
  RouteComponent: ComponentType<Props>
): ComponentType<Props> => {
  const WrappedRouteComponent: React.FC<Props> = (props) => {
    const { entityId } = normalizeRouteParams(useParams());
    const { vitalsPageStore } = useCoreStore();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(
      action("sync route params", () => {
        vitalsPageStore.currentEntityId = entityId;
      })
    );

    return <RouteComponent {...props} />;
  };

  return observer(WrappedRouteComponent);
};

export default withRouteSync;
