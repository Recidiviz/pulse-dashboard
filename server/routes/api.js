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
 * This file contains route handlers for calls to our Metrics API, to be mapped to app routes
 * in server.js.
 */

const metricsApi = require('../core/metricsApi');

const IS_DEMO = (process.env.IS_DEMO === 'true');

/**
 * A callback which returns either either an error payload or a data payload.
 */
function responder(res) {
  return function respond(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  };
}

function programEval(req, res) {
  metricsApi.fetchProgramEvalMetrics(IS_DEMO, responder(res));
}

function reincarcerations(req, res) {
  metricsApi.fetchReincarcerationMetrics(IS_DEMO, responder(res));
}

function revocations(req, res) {
  metricsApi.fetchRevocationMetrics(IS_DEMO, responder(res));
}

function snapshots(req, res) {
  metricsApi.fetchSnapshotMetrics(IS_DEMO, responder(res));
}

module.exports = {
  programEval,
  reincarcerations,
  revocations,
  snapshots,
};
