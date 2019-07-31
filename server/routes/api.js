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
  res.send({
    releases: [105, 107, 141, 116, 128, 93],
    admissions: [108, 97, 130, 113, 127, 115],
    ratesByReleaseFacility: {
      'DWCRC': 0.12195121951219512,
      'NDSP': 0.2913752913752914,
      'JRCC': 0.29393939393939394,
      'MRCC': 0.23225806451612904,
      'TRCC': 0.3458646616541353,
      'County Jails': 0.3103448275862069,
      'Out of State': 0.21428571428571427,
    },
    ratesByTransitionalFacility: {
      'FTPFAR': 0.16363636363636364,
      'GFC': 0.1875,
      'BTC': 0.18981481481481483,
      'FTPMND': 0.2222222222222222,
      'MTPFAR': 0.2898550724637681,
      'LRRP': 0.3333333333333333,
      'MTPMND': 0.3333333333333333,
    },
    ratesByStayLength: {
      '0-12': 0.2781569965870307,
      '12-24': 0.26384364820846906,
      '24-36': 0.16216216216216217,
      '36-48': 0.1388888888888889,
      '48-60': 0.16666666666666666
    },
    reincarcerationCountsByMonth: {
      'November': 33,
      'December': 10,
      'January': 25,
      'February': 27,
      'March': 34,
      'April': 31
    },
    revocationCountsByMonth: {
      'November': 40,
      'December': 48,
      'January': 60,
      'February': 44,
      'March': 54,
      'April': 52
    },
    revocationCountsByMonthBySupervisionType: {
      'November': {probation: 9, parole: 31},
      'December': {probation: 10, parole: 38},
      'January': {probation: 12, parole: 48},
      'February': {probation: 10, parole: 34},
      'March': {probation: 17, parole: 37},
      'April': {probation: 16, parole: 36}
    },
    revocationCountsByMonthByViolationType: {
      'November': {newOffense:17, absconsion:15,  technical:8},
      'December': {newOffense:22, absconsion:19,  technical: 7},
      'January': {newOffense:26, absconsion:24,  technical: 10},
      'February': {newOffense:17, absconsion:21,  technical: 6},
      'March': {newOffense:22, absconsion:24,  technical: 8},
      'April': {newOffense:21, absconsion:23,  technical: 8},
    },
    revocationCountsByOfficer: {
      '176': {technical: 7, nonTechnical: 2},
      '46': {technical: 2, nonTechnical: 5},
      '143': {technical: 2, nonTechnical: 4},
      '702': {technical: 6, nonTechnical: 0},
      '125': {technical: 4, nonTechnical: 1},
      '139': {technical: 1, nonTechnical: 4},
      '142': {technical: 4, nonTechnical: 1},
      '165': {technical: 1, nonTechnical: 4},
    },
    admissionCountsByType: {
      'New admissions': 121,
      'Non-technical revocations': 40,
      'Technical revocations': 48,
      'Other': 11,
      'Unknown': 29,
    },
    revocationProportionByRace: {
      'American Indian Alaskan Native': 30.0,
      'Asian': 0.0,
      'Black': 5.7,
      'Native Hawaiian Pacific Islander': 0.0,
      'White': 57.7,
      'Other': 6.6,
    },
    recidivismRateByProgram: {
      'Program A': {newOffenses: 30.3, revocations: 10.5},
      'Program B': {newOffenses: 38.0, revocations: 13.5},
      'Program C': {newOffenses: 36.3, revocations: 12.3},
      'Program D': {newOffenses: 34.3, revocations: 11.6},
      'Program E': {newOffenses: 30.6, revocations: 11.0},
      'Program F': {newOffenses: 33.1, revocations: 12.8},
    },
    costEffectivenessByProgram: {
      'Program A': -123600,
      'Program B': 704000,
      'Program C': 554400,
      'Program D': 378400,
      'Program E': -122200,
      'Program F': -432800,
    }
  });
}

module.exports = {
  admissions: admissions,
  reincarcerations: reincarcerations,
  revocations: revocations,
  external: external,
}
