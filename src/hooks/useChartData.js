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

import { useState, useCallback, useEffect } from "react";
import moment from "moment";
import makeCancellablePromise from "make-cancellable-promise";
import { useAuth0 } from "../react-auth0-spa";

import parseResponseByFileFormat from "../api/metrics/parseResponseByFileFormat";
import { callMetricsApi, awaitingResults } from "../api/metrics/metricsClient";

// 5 minutes now
const CACHE_LIFETIME = 300000;

const apiCache = {};

/**
 * A hook which fetches the given file at the given API service URL. Returns
 * state which will populate with the response data and a flag indicating whether
 * or not the response is still loading, in the form of `{ apiData, isLoading }`.
 */
function useChartData(url, file) {
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState([]);
  const [awaitingApi, setAwaitingApi] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchChartData = useCallback(async () => {
    const cacheKey = `${url}-${file}`;

    try {
      if (apiCache[cacheKey] && apiCache[cacheKey].loading) {
        const promise = new Promise((resolve) => {
          apiCache[cacheKey].queue.push(resolve);
        });

        return await promise;
      }

      if (
        apiCache[cacheKey] &&
        moment().diff(apiCache[cacheKey].date) < CACHE_LIFETIME
      ) {
        return apiCache[cacheKey].data;
      }

      apiCache[cacheKey] = {
        loading: true,
        queue: [],
      };

      const responseData = await callMetricsApi(
        file ? `${url}/${file}` : url,
        getTokenSilently
      );

      apiCache[cacheKey].queue.forEach((promise) => {
        promise(responseData);
      });
      apiCache[cacheKey] = {
        loading: false,
        queue: [],
        data: responseData,
        date: moment(),
      };

      return responseData;
    } catch (error) {
      delete apiCache[cacheKey];
      console.error(error);
      throw error;
    }
  }, [file, getTokenSilently, url]);

  useEffect(() => {
    const { promise, cancel } = makeCancellablePromise(fetchChartData());

    promise
      .then((response) => {
        const metricFiles = parseResponseByFileFormat(response, file);
        const data = file ? metricFiles[file] : metricFiles;
        setApiData(data);
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        setAwaitingApi(false);
      });

    return () => {
      cancel();
    };
  }, [fetchChartData, file]);

  const isLoading = awaitingResults(loading, user, awaitingApi);

  return { apiData, isLoading, isError };
}

export default useChartData;
