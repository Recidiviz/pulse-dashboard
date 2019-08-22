/**
 * Route handlers for calls to our Metrics API, to be mapped to app routes in server.js.
 */

const metricsApi = require("../core/metricsApi");

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

function admissions(req, res) {
  metricsApi.fetchAdmissionMetrics(responder(res));
}

function reincarcerations(req, res) {
  metricsApi.fetchReincarcerationMetrics(responder(res));
}

function revocations(req, res) {
  metricsApi.fetchRevocationMetrics(responder(res));
}

// TODO: Deprecate this once we are ready to switch on the live APIs
function external(req, res) {
  metricsApi.fetchExternalMetrics(responder(res));
}

module.exports = {
  admissions: admissions,
  external: external,
  reincarcerations: reincarcerations,
  revocations: revocations,
  external: external,
}
