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

import { parseResponseByFileFormat } from "./fileParser";
import logger from "../../utils/logger";

/**
 * An asynchronous function that returns a promise which will eventually return the results from
 * invoking the given API endpoint. Takes in the |endpoint| as a string and the |getTokenSilently|
 * function, which will be used to authenticate the client against the API.
 */
async function callMetricsApi(endpoint, getTokenSilently) {
  try {
    const token = await getTokenSilently();

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

/**
 * A synchronous function that fetches data for the given state, metric type, and file. Takes in
 * functions for setting the API response and a flag indicating whether or not we are still
 * awaiting the API response.
 */
const fetchChartData = async (
  stateCode,
  metricType,
  file,
  setApiResponse,
  setAwaitingFlag,
  getTokenSilently
) => {
  try {
    const responseData = await callMetricsApi(
      `${stateCode.toLowerCase()}/${metricType}/${file}`,
      getTokenSilently
    );

    const metricFile = parseResponseByFileFormat(responseData, file);
    setApiResponse(metricFile);
    setAwaitingFlag(false);
  } catch (error) {
    logger.error(error);
  }
};

/**
 * A convenience function returning whether or not the client is still awaiting what it needs to
 * display results to the user. We are ready if we are no longer loading the view, if we are no
 * longer awaiting the API, and if we have an authenticated user.
 */
function awaitingResults(loading, user, awaitingApi) {
  return loading || !user || awaitingApi;
}

export { callMetricsApi, fetchChartData, awaitingResults };