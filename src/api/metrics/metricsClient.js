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
/**
 * Validates the response object from fetch and returns the resolved response data.
 * Throws an error if response is not OK (status >= 400)
 * @param {*} response - The Response object from the Fetch API
 */
async function validateResponse(response) {
  const responseJson = await response.json();
  if (!response.ok) {
    throw new Error(
      `Fetching data from API failed.\nStatus: ${responseJson.status} - ${
        response.statusText
      }\nErrors: ${JSON.stringify(responseJson.errors)}`
    );
  } else {
    return responseJson;
  }
}

/**
 * An asynchronous function that returns a promise which will eventually return the results from
 * invoking the given API endpoint. Takes in the |endpoint| as a string and the |getTokenSilently|
 * function, which will be used to authenticate the client against the API.
 */
async function callMetricsApi(endpoint, getTokenSilently) {
  const token = await getTokenSilently();

  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/api/${endpoint}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const responseJson = await validateResponse(response);

  return responseJson;
}

/**
 * An asynchronous function that returns a promise which will eventually return the results from
 * invoking the given API endpoint. Takes in the |endpoint| as a string, the |userEmail| as a string,
 * and the |getTokenSilently| function, which will be used to authenticate the client against the API.
 */
async function callRestrictedAccessApi(endpoint, userEmail, getTokenSilently) {
  const token = await getTokenSilently();
  const retryTimes = 3;
  const responseJson = await fetchWithRetry(
    `${process.env.REACT_APP_API_URL}/api/${endpoint}`,
    {
      body: JSON.stringify({
        userEmail,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
    retryTimes
  );
  return responseJson;
}

async function fetchWithRetry(endpoint, options, retryTimes) {
  try {
    const response = await fetch(endpoint, options);
    return await validateResponse(response);
  } catch (error) {
    if (retryTimes === 1) {
      throw error;
    }
    return fetchWithRetry(endpoint, options, retryTimes - 1);
  }
}

/**
 * A convenience function returning whether or not the client is still awaiting what it needs to
 * display results to the user. We are ready if we are no longer loading the view, if we are no
 * longer awaiting the API, and if we have an authenticated user.
 */
function awaitingResults(loading, user, awaitingApi) {
  return loading || !user || awaitingApi;
}

export { callMetricsApi, callRestrictedAccessApi, awaitingResults };
