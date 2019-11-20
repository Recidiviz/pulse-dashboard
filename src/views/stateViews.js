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

import UsNdFreeThroughRecovery from './tenants/us_nd/FreeThroughRecovery';
import UsNdReincarcerations from './tenants/us_nd/Reincarcerations';
import UsNdRevocations from './tenants/us_nd/Revocations';
import UsNdSnapshots from './tenants/us_nd/Snapshots';

import UsMoSnapshots from './tenants/us_mo/Snapshots';

const STATE_VIEW_COMPONENTS = {
  us_nd: {
    '/programevaluation/freethroughrecovery': UsNdFreeThroughRecovery,
    '/reincarcerations': UsNdReincarcerations,
    '/revocations': UsNdRevocations,
    '/snapshots': UsNdSnapshots,
  },
  us_mo: {
    '/snapshots': UsMoSnapshots,
  },
};

function getAvailableStates() {
  return Object.keys(STATE_VIEW_COMPONENTS);
}

function getFirstAvailableState() {
  const stateCodes = getAvailableStates();
  return stateCodes.sort()[0];
}

function getAvailableViewsForState(stateCode) {
  const views = STATE_VIEW_COMPONENTS[stateCode.toLowerCase()];
  if (!views) {
    return [];
  }
  return Object.keys(views);
}

const CURRENT_STATE_IN_SESSION = 'recidivizUserCurrentStateInSession';

function getCurrentState() {
  const fromStorage = sessionStorage.getItem(CURRENT_STATE_IN_SESSION);
  if (!fromStorage) {
    return getFirstAvailableState();
  }
  return fromStorage.toLowerCase();
}

function setCurrentState(stateCode) {
  sessionStorage.setItem(CURRENT_STATE_IN_SESSION, stateCode.toLowerCase());
}

function getComponentForStateView(stateCode, view) {
  const normalizedCode = (stateCode === 'recidiviz') ? getCurrentState() : stateCode.toLowerCase();

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
  getAvailableStates,
  getFirstAvailableState,
  getAvailableViewsForState,
  getComponentForStateView,
  getCurrentState,
  setCurrentState,
};
