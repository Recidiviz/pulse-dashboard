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
const { fetchMetrics } = require("../core");
const { default: isDemoMode } = require("../utils/isDemoMode");
/**
 * A callback which returns either either an error payload or a data payload.
 */
function responder(res) {
  return (err, data) => {
    if (err) {
      const status = err.status || 500;
      res.status(status).send(err);
    } else {
      res.send(data);
    }
  };
}

const BAD_REQUEST = 400;

// TODO: Generalize this API to take in the metric type and file as request parameters in all calls

function newRevocations(req, res) {
  fetchMetrics(
    req.params.stateCode,
    "newRevocation",
    null,
    isDemoMode,
    responder(res)
  );
}

function newRevocationFile(req, res) {
  const validations = validationResult(req);
  const hasErrors = !validations.isEmpty();
  if (hasErrors) {
    responder(res)({ status: BAD_REQUEST, errors: validations.array() }, null);
  } else {
    fetchMetrics(
      req.params.stateCode,
      "newRevocation",
      req.params.file,
      isDemoMode,
      responder(res)
    );
  }
}

function communityGoals(req, res) {
  fetchMetrics(
    req.params.stateCode,
    "communityGoals",
    null,
    isDemoMode,
    responder(res)
  );
}

function communityExplore(req, res) {
  fetchMetrics(
    req.params.stateCode,
    "communityExplore",
    null,
    isDemoMode,
    responder(res)
  );
}

function facilitiesGoals(req, res) {
  fetchMetrics(
    req.params.stateCode,
    "facilitiesGoals",
    null,
    isDemoMode,
    responder(res)
  );
}

function facilitiesExplore(req, res) {
  fetchMetrics(
    req.params.stateCode,
    "facilitiesExplore",
    null,
    isDemoMode,
    responder(res)
  );
}

function programmingExplore(req, res) {
  fetchMetrics(
    req.params.stateCode,
    "programmingExplore",
    null,
    isDemoMode,
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
};
