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
import { useAuth0 } from "../react-auth0-spa";
import {
  parseResponseByFileFormat,
  parseResponsesByFileFormat,
} from "../api/metrics/fileParser";
import { callMetricsApi, awaitingResults } from "../api/metrics/metricsClient";

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
    try {
      if (file) {
        const responseData = await callMetricsApi(
          `${url}/${file}`,
          getTokenSilently
        );

        const metricFile = parseResponseByFileFormat(responseData, file);
        setApiData(metricFile);
      } else {
        const responseData = await callMetricsApi(url, getTokenSilently);

        const metricFiles = parseResponsesByFileFormat(responseData);
        setApiData(metricFiles);
      }
      setAwaitingApi(false);
    } catch (error) {
      setAwaitingApi(false);
      setIsError(true);
      console.error(error);
    }
  }, [file, getTokenSilently, url]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const isLoading = awaitingResults(loading, user, awaitingApi);

  return { apiData, isLoading, isError };
}

export default useChartData;
