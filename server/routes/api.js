/**
 * Route handlers for calls to our Metrics API, to be mapped to app routes in server.js.
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
