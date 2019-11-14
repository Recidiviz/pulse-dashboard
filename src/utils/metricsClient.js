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

import { isDemoMode } from './authentication/viewAuthentication';

/**
 * An asynchronous function that returns a promise which will eventually return the results from
 * invoking the given API endpoint. Takes in the |endpoint| as a string and the |getTokenSilently|
 * function, which will be used to authenticate the client against the API, if we are not in demo
 * mode where authentication is not required.
 */
async function callMetricsApi(endpoint, getTokenSilently) {
  try {
    let token = '';
    if (!isDemoMode()) {
      token = await getTokenSilently();
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * A convenience function returning whether or not the client is still awaiting what it needs to
 * display results to the user. We are ready if we are no longer loading the view, if we are no
 * longer awaiting the API, and if we either have an authenticated user or we are in demo mode.
 */
function awaitingResults(loading, user, awaitingApi) {
  return loading || (!user && !isDemoMode()) || awaitingApi;
}

export {
  callMetricsApi,
  awaitingResults,
};
