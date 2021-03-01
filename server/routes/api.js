// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
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
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
const {
  refreshRedisCache,
  fetchMetrics,
  cacheResponse,
  fetchAndFilterNewRevocationFile,
  filterRestrictedAccessEmails,
} = require("../core");
const { default: isDemoMode } = require("../utils/isDemoMode");
const { getCacheKey } = require("../utils/cacheKeys");

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
      const errors = err.message || err.errors;
      res.status(status).send({
        status,
        errors: [].concat(errors),
      });
    } else {
      res.send(data);
    }
  };
}

/**
 * A callback which processes fetch result data with a given
 * processResultFn before passing the processed result to
 * the responder function.
 */
function processAndRespond(responderFn, processResultsFn) {
  return (err, data) => {
    if (err) responderFn(err, null);
    if (data) {
      try {
        responderFn(null, processResultsFn(data));
      } catch (error) {
        responderFn(error, null);
      }
    }
  };
}
// TODO: Generalize this API to take in the metric type and file as request parameters in all calls

function restrictedAccess(req, res) {
  const validations = validationResult(req);
  const hasErrors = !validations.isEmpty();
  if (hasErrors) {
    responder(res)(
      {
        status: BAD_REQUEST,
        errors: validations.array(),
      },
      null
    );
  } else {
    const { stateCode } = req.params;
    const { userEmail } = req.body;
    const metricType = "newRevocation";
    const metricName = "supervision_location_restricted_access_emails";
    const cacheKey = `${stateCode.toUpperCase()}-${metricType}-restrictedAccess`;

    cacheResponse(
      cacheKey,
      () => fetchMetrics(stateCode, metricType, metricName, isDemoMode),
      processAndRespond(
        responder(res),
        filterRestrictedAccessEmails(userEmail, metricName)
      )
    );
  }
}

function refreshCache(req, res) {
  const { stateCode } = req.params;
  const metricType = "newRevocation";
  refreshRedisCache(
    () => fetchMetrics(stateCode, metricType, null, isDemoMode),
    stateCode,
    "newRevocation",
    responder(res)
  );
}

function newRevocations(req, res) {
  const { stateCode } = req.params;
  const metricType = "newRevocation";
  const cacheKey = getCacheKey({ stateCode, metricType });
  cacheResponse(
    cacheKey,
    () => fetchMetrics(stateCode, metricType, null, isDemoMode),
    responder(res)
  );
}

function newRevocationFile(req, res) {
  const metricType = "newRevocation";
  const validations = validationResult(req);
  const hasErrors = !validations.isEmpty();
  if (hasErrors) {
    responder(res)({ status: BAD_REQUEST, errors: validations.array() }, null);
  } else {
    const { stateCode, file: metricName } = req.params;
    const queryParams = req.query || {};
    const cacheKey = getCacheKey({
      stateCode,
      metricType,
      metricName,
      cacheKeySubset: queryParams,
    });
    cacheResponse(
      cacheKey,
      () =>
        fetchAndFilterNewRevocationFile({
          stateCode,
          metricType,
          metricName,
          queryParams,
          isDemoMode,
        }),
      responder(res)
    );
  }
}

function communityGoals(req, res) {
  const { stateCode } = req.params;
  const metricType = "communityGoals";
  const cacheKey = getCacheKey({ stateCode, metricType });
  cacheResponse(
    cacheKey,
    () => fetchMetrics(stateCode, metricType, null, isDemoMode),
    responder(res)
  );
}

function communityExplore(req, res) {
  const { stateCode } = req.params;
  const metricType = "communityExplore";
  const cacheKey = getCacheKey({ stateCode, metricType });
  cacheResponse(
    cacheKey,
    () => fetchMetrics(stateCode, metricType, null, isDemoMode),
    responder(res)
  );
}

function facilitiesGoals(req, res) {
  const { stateCode } = req.params;
  const metricType = "facilitiesGoals";
  const cacheKey = getCacheKey({ stateCode, metricType });
  cacheResponse(
    cacheKey,
    () => fetchMetrics(stateCode, metricType, null, isDemoMode),
    responder(res)
  );
}

function facilitiesExplore(req, res) {
  const { stateCode } = req.params;
  const metricType = "facilitiesExplore";
  const cacheKey = getCacheKey({ stateCode, metricType });
  cacheResponse(
    cacheKey,
    () => fetchMetrics(stateCode, metricType, null, isDemoMode),
    responder(res)
  );
}

function programmingExplore(req, res) {
  const { stateCode } = req.params;
  const metricType = "programmingExplore";
  const cacheKey = getCacheKey({ stateCode, metricType });
  cacheResponse(
    cacheKey,
    () => fetchMetrics(stateCode, metricType, null, isDemoMode),
    responder(res)
  );
}

function generateFileLink(req, res) {
  const { file } = req;
  const fileName = `${uuid.v4()}-${file.originalname}`;

  fs.writeFile(`/tmp/${fileName}`, file.buffer, function (err) {
    if (err) {
      throw new Error(
        `Failed to write file for download: ${fileName}. ${err.message}`
      );
    }
  });
  res.send(`https://${req.headers.host}/file/${fileName}`);
}

function upload(req, res) {
  const options = {
    root: "/tmp",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  const fileName = req.params.name;

  res.sendFile(fileName, options, (sendErr) => {
    if (sendErr) {
      throw new Error(
        `Failed to send file for download: ${fileName}. ${sendErr.message}`
      );
    }

    /* Checking on Chrome iOS */
    if (!req.headers["upgrade-insecure-requests"]) {
      fs.unlink(path.join("/tmp", fileName), (delErr) => {
        /* Delete temp file after it's been sent */
        if (delErr) {
          throw new Error(
            `Failed to delete file: ${fileName}. ${delErr.message}`
          );
        }
      });
    }
  });
}

module.exports = {
  restrictedAccess,
  newRevocations,
  newRevocationFile,
  communityGoals,
  communityExplore,
  facilitiesGoals,
  facilitiesExplore,
  programmingExplore,
  responder,
  refreshCache,
  generateFileLink,
  upload,
  SERVER_ERROR,
};
