/**
 * Route handlers for calls to our Metrics API, to be mapped to app routes in server.js.
 */

const metricsApi = require('../core/metricsApi');

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
  metricsApi.fetchProgramEvalMetrics(responder(res));
}

function reincarcerations(req, res) {
  metricsApi.fetchReincarcerationMetrics(responder(res));
}

function revocations(req, res) {
  metricsApi.fetchRevocationMetrics(responder(res));
}

function snapshots(req, res) {
  metricsApi.fetchSnapshotMetrics(responder(res));
}

module.exports = {
  programEval,
  reincarcerations,
  revocations,
  snapshots,
};
