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
import makeCancellablePromise from "make-cancellable-promise";
import { useAuth0 } from "../react-auth0-spa";

import parseResponseByFileFormat from "../api/metrics/parseResponseByFileFormat";
import { callMetricsApi, awaitingResults } from "../api/metrics/metricsClient";
import { useCachedChartData } from "../contexts/ChartDataContext";

const queues = {};

/**
 * A hook which fetches the given file at the given API service URL. Returns
 * state which will populate with the response data and a flag indicating whether
 * or not the response is still loading, in the form of `{ apiData, isLoading }`.
 */
function useChartData(tenant, file) {
  const { getCachedFile, setCachedFile } = useCachedChartData();
  const { loading, user, getTokenSilently } = useAuth0();
  const [apiData, setApiData] = useState([]);
  const [awaitingApi, setAwaitingApi] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchChartData = useCallback(async () => {
    const cacheKey = `${tenant}-${file}`;
    try {
      if (queues[cacheKey]) {
        return await new Promise((resolve) => {
          queues[cacheKey].push(resolve);
        });
      }

      const cachedFile = getCachedFile(tenant, file);
      if (cachedFile) {
        return cachedFile;
      }

      queues[cacheKey] = [];

      const responseData = await callMetricsApi(
        file ? `${tenant}/${file}` : tenant,
        getTokenSilently
      );

      setCachedFile(tenant, file, responseData);

      queues[cacheKey].forEach((promise) => {
        promise(responseData);
      });

      delete queues[cacheKey];

      return responseData;
    } catch (error) {
      delete queues[cacheKey];
      console.error(error);
      throw error;
    }
  }, [file, tenant, getTokenSilently, getCachedFile, setCachedFile]);

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
