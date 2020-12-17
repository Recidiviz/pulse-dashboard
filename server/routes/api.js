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

const {
  refreshRedisCache,
  fetchMetrics,
  cacheInRedis,
  cacheInMemory,
} = require("../core");
const { default: isDemoMode } = require("../utils/isDemoMode");

/**
 * A callback which returns either an error payload or a data payload.
 */
function responder(res) {
  return (err, data) => {
    if (err) {
      res.send(err);
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
  const cacheKey = `${stateCode}-newRevocation`;
  cacheInRedis(
    cacheKey,
    () => fetchMetrics(stateCode, "newRevocation", null, isDemoMode),
    responder(res)
  );
}

function newRevocationFile(req, res) {
  const { stateCode, file } = req.params;
  const cacheKey = `${stateCode}-newRevocation-${file}`;
  cacheInRedis(
    cacheKey,
    () => fetchMetrics(stateCode, "newRevocation", file, isDemoMode),
    responder(res)
  );
}

function communityGoals(req, res) {
  const { stateCode } = req.params;
  const cacheKey = `${stateCode}-communityGoals`;
  cacheInMemory(
    cacheKey,
    () => fetchMetrics(stateCode, "communityGoals", null, isDemoMode),
    responder(res)
  );
}

function communityExplore(req, res) {
  const { stateCode } = req.params;
  const cacheKey = `${stateCode}-communityExplore`;
  cacheInMemory(
    cacheKey,
    () => fetchMetrics(stateCode, "communityExplore", null, isDemoMode),
    responder(res)
  );
}

function facilitiesGoals(req, res) {
  const { stateCode } = req.params;
  const cacheKey = `${stateCode}-facilitiesGoals`;
  cacheInMemory(
    cacheKey,
    () => fetchMetrics(stateCode, "facilitiesGoals", null, isDemoMode),
    responder(res)
  );
}

function facilitiesExplore(req, res) {
  const { stateCode } = req.params;
  const cacheKey = `${stateCode}-facilitiesExplore`;
  cacheInMemory(
    cacheKey,
    () => fetchMetrics(stateCode, "facilitiesExplore", null, isDemoMode),
    responder(res)
  );
}

function programmingExplore(req, res) {
  const { stateCode } = req.params;
  const cacheKey = `${stateCode}-programmingExplore`;
  cacheInMemory(
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
