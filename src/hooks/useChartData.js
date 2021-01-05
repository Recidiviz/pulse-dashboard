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
import toInteger from "lodash/fp/toInteger";
import { useAuth0 } from "../react-auth0-spa";
import {
  parseResponseByFileFormat,
  parseResponsesByFileFormat,
} from "../api/metrics/fileParser";
import { convertFromStringToUnflattenedMatrix } from "../api/metrics/optimizedFormatHelpers";
import { callMetricsApi, awaitingResults } from "../api/metrics/metricsClient";
import { getQueryStringFromFilters } from "../api/metrics/urlHelpers";

const queues = {};

/**
 * A hook which fetches the given file at the given API service URL. Returns
 * state which will populate with the response data and a flag indicating whether
 * or not the response is still loading, in the form of `{ apiData, isLoading, isError, unflattenedValues }`.
 *
 * `unflattenValues` is the unflattened value matrix from the apiData and is only
 * populated if the request was for a specific file, if that file was in the optimized
 * format, and if eagerExpand is set to false.
 *
 * `eagerExpand` defaults to true, which means that by default we immediately expand
 * the optimized format into an array of deserialized objects. If set to false, this
 * returns `apiData` in its optimized format, with keys of `flattenedValueMatrix` and
 * `metadata`, and `unflattenedValues` is produced and returned as a convenience to
 * ensure we do not need to proactively and repeatedly unflatten the value matrix
 * on subsequent filter operations.
 */
function useChartData(url, file, filterStates = {}, eagerExpand = true) {
  const { loading, user, getTokenSilently } = useAuth0();
  const [metadata, setMetadata] = useState({});
  const [apiData, setApiData] = useState([]);
  const [awaitingApi, setAwaitingApi] = useState(true);
  const [isError, setIsError] = useState(false);

  const queryString = getQueryStringFromFilters(filterStates);

  const fetchChartData = useCallback(async () => {
    try {
      const fileKey = `${url}-${file}`;

      if (queues[fileKey]) {
        return new Promise((resolve) => {
          queues[fileKey].push(resolve);
        });
      }

      queues[fileKey] = [];

      const responseData = await callMetricsApi(
        file ? `${url}/${file}${queryString}` : `${url}${queryString}`,
        getTokenSilently
      );
      queues[fileKey].forEach((resolve) => resolve(responseData));
      delete queues[fileKey];

      return await responseData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [file, queryString, getTokenSilently, url]);

  useEffect(() => {
    const { cancel, promise } = makeCancellablePromise(fetchChartData());
    promise
      .then((responseData) => {
        if (file) {
          const metricFile = parseResponseByFileFormat(
            responseData,
            file,
            eagerExpand
          );
          setMetadata(metricFile.metadata);

          // If we are not eagerly expanding a single file request, then proactively
          // unflatten the data matrix to avoid repeated unflattening operations in
          // filtering operations later on.
          if (!eagerExpand) {
            const totalDataPoints = toInteger(
              metricFile.metadata.total_data_points
            );
            const unflattened =
              totalDataPoints === 0
                ? []
                : convertFromStringToUnflattenedMatrix(
                    metricFile.flattenedValueMatrix,
                    totalDataPoints
                  );
            setApiData(unflattened);
          } else setApiData(metricFile);
        } else {
          const metricFiles = parseResponsesByFileFormat(
            responseData,
            eagerExpand
          );
          setApiData(metricFiles);
        }
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
  }, [eagerExpand, fetchChartData, file]);

  const isLoading = awaitingResults(loading, user, awaitingApi);

  return { metadata, isLoading, isError, apiData };
}

export default useChartData;
