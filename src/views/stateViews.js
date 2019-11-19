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

import FreeThroughRecovery from './FreeThroughRecovery';
import Reincarcerations from './Reincarcerations';
import Revocations from './Revocations';
import Snapshots from './Snapshots';

const STATE_VIEW_COMPONENTS = {
  us_nd: {
    '/programevaluation/freethroughrecovery': FreeThroughRecovery,
    '/reincarcerations': Reincarcerations,
    '/revocations': Revocations,
    '/snapshots': Snapshots,
  },
};

function getAvailableViewsForState(stateCode) {
  const views = STATE_VIEW_COMPONENTS[stateCode.toLowerCase()];
  if (!views) {
    return [];
  }
  return Object.keys(views);
}

function getComponentForStateView(stateCode, view) {
  // TODO: get the correct state for a Recidiviz user based on current session
  const normalizedCode = (stateCode === 'recidiviz') ? 'us_nd' : stateCode.toLowerCase();

  const stateComponents = STATE_VIEW_COMPONENTS[normalizedCode];
  if (!stateComponents) {
    throw Error(`No components registered for state ${normalizedCode}`);
  }

  const component = stateComponents[view.toLowerCase()];
  if (!component) {
    throw Error(`No components registered for state ${normalizedCode}
      for view ${view.toLowerCase()}`);
  }

  return component;
}

export {
  getAvailableViewsForState,
  getComponentForStateView,
};
