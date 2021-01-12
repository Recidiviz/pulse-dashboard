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

/**
 * This file contains route handlers for calls to our Metrics API, to be mapped to app routes
 * in server.js.
 */

const { validationResult } = require("express-validator");
const { refreshRedisCache, fetchMetrics, cacheResponse } = require("../core");
const { default: isDemoMode } = require("../utils/isDemoMode");

const BAD_REQUEST = 400;
const SERVER_ERROR = 500;

/**
 * A callback which returns either an error payload or a data payload.
 *
 * Structure of error responses from GCS
 * https://cloud.google.com/storage/docs/json_api/v1/status-codes#404-not-found
 */
function responder(res) {
  return (err, data) => {
    if (err) {
      const status = err.status || err.code || SERVER_ERROR;
      res.status(status).send(err);
    } else {
      res.send(data);
    }
  };
}

// TODO: Generalize this API to take in the metric type and file as request parameters in all calls

function refreshCache(req, res) {
  const { stateCode } = req.params;
  refreshRedisCache(
    () => fetchMetrics(stateCode, "newRevocation", null, isDemoMode),
    stateCode,
    "newRevocation",
    responder(res)
  );
}

function newRevocations(req, res) {
  const { stateCode } = req.params;
  const cacheKey = `${stateCode.toUpperCase()}-newRevocation`;
  cacheResponse(
    cacheKey,
    () => fetchMetrics(stateCode, "newRevocation", null, isDemoMode),
    responder(res)
  );
}

function newRevocationFile(req, res) {
  const validations = validationResult(req);
  const hasErrors = !validations.isEmpty();
  if (hasErrors) {
    responder(res)({ status: BAD_REQUEST, errors: validations.array() }, null);
  } else {
    const { stateCode, file } = req.params;
    const cacheKey = `${stateCode.toUpperCase()}-newRevocation-${file}`;
    cacheResponse(
      cacheKey,
      () => fetchMetrics(stateCode, "newRevocation", file, isDemoMode),
      responder(res)
    );
  }
}

function communityGoals(req, res) {
  const { stateCode } = req.params;
  const cacheKey = `${stateCode.toUpperCase()}-communityGoals`;
  cacheResponse(
    cacheKey,
    () => fetchMetrics(stateCode, "communityGoals", null, isDemoMode),
    responder(res)
  );
}

function communityExplore(req, res) {
  const { stateCode } = req.params;
  const cacheKey = `${stateCode.toUpperCase()}-communityExplore`;
  cacheResponse(
    cacheKey,
    () => fetchMetrics(stateCode, "communityExplore", null, isDemoMode),
    responder(res)
  );
}

function facilitiesGoals(req, res) {
  const { stateCode } = req.params;
  const cacheKey = `${stateCode.toUpperCase()}-facilitiesGoals`;
  cacheResponse(
    cacheKey,
    () => fetchMetrics(stateCode, "facilitiesGoals", null, isDemoMode),
    responder(res)
  );
}

function facilitiesExplore(req, res) {
  const { stateCode } = req.params;
  const cacheKey = `${stateCode.toUpperCase()}-facilitiesExplore`;
  cacheResponse(
    cacheKey,
    () => fetchMetrics(stateCode, "facilitiesExplore", null, isDemoMode),
    responder(res)
  );
}

function programmingExplore(req, res) {
  const { stateCode } = req.params;
  const cacheKey = `${stateCode.toUpperCase()}-programmingExplore`;
  cacheResponse(
    cacheKey,
    () => fetchMetrics(stateCode, "programmingExplore", null, isDemoMode),
    responder(res)
  );
}

module.exports = {
  newRevocations,
  newRevocationFile,
  communityGoals,
  communityExplore,
  facilitiesGoals,
  facilitiesExplore,
  programmingExplore,
  responder,
  refreshCache,
};
