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

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const multer = require("multer");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const Sentry = require("@sentry/node");

const devAuthConfig = require("../src/auth_config_dev.json");
const productionAuthConfig = require("../src/auth_config_production.json");
const api = require("./routes/api");
const {
  newRevocationsParamValidations,
  restrictedAccessParamValidations,
} = require("./routes/paramsValidation");

const app = express();

const upload = multer();

Sentry.init({
  environment: process.env.SENTRY_ENV,
  dsn: process.env.SENTRY_DNS,
});

// The Sentry request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

app.use(cors());

const port = process.env.NODE_ENV === "test" ? 3002 : process.env.PORT || 3001;

app.set("port", port);

const isDemoMode = process.env.IS_DEMO === "true";

const authEnv = process.env.AUTH_ENV;

let authConfig = null;
if (authEnv === "production") {
  authConfig = productionAuthConfig;
} else if (authEnv === "development") {
  authConfig = devAuthConfig;
} else {
  authConfig = { domain: "test", audience: "test" };
}

if (!authConfig.domain || !authConfig.audience) {
  throw new Error(
    "Please make sure that auth_config.json is in place and populated"
  );
}

app.use(morgan("dev"));
app.use(helmet());

if (app.get("env") === "production") {
  // This is required to avoid "Unable to verify authorization request state" with Auth0
  app.set("trust proxy", true);
}

let checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

// See: https://cloud.google.com/appengine/docs/standard/nodejs/scheduling-jobs-with-cron-yaml#validating_cron_requests
function validateCronRequest(req, res, next) {
  if (req.get("X-Appengine-Cron") !== "true" && !isDemoMode) {
    res.sendStatus(403);
  } else {
    next();
  }
}

function errorHandler(err, _req, res, next) {
  if (err && err.message) {
    res
      .status(api.SERVER_ERROR)
      .send({ status: api.SERVER_ERROR, errors: [err.message] });
  } else {
    next(err);
  }
}

if (isDemoMode) {
  checkJwt = (req, res, next) => {
    next();
  };
}

app.get("/api/:stateCode/refreshCache", validateCronRequest, api.refreshCache);
app.get("/api/:stateCode/newRevocations", checkJwt, api.newRevocations);
app.get(
  "/api/:stateCode/newRevocations/:file",
  [checkJwt, ...newRevocationsParamValidations],
  api.newRevocationFile
);
app.get("/api/:stateCode/community/goals", checkJwt, api.communityGoals);
app.get("/api/:stateCode/community/explore", checkJwt, api.communityExplore);
app.get("/api/:stateCode/facilities/goals", checkJwt, api.facilitiesGoals);
app.get("/api/:stateCode/facilities/explore", checkJwt, api.facilitiesExplore);
app.get(
  "/api/:stateCode/programming/explore",
  checkJwt,
  api.programmingExplore
);
app.post(
  "/api/:stateCode/restrictedAccess",
  express.json(),
  [checkJwt, ...restrictedAccessParamValidations],
  api.restrictedAccess
);
app.post(
  "/api/generateFileLink",
  checkJwt,
  upload.single("zip"),
  api.generateFileLink
);
app.get("/file/:name", api.upload);

// An App Engine-specific API for handling warmup requests on new instance initialization
app.get("/_ah/warmup", () => {
  // The server automatically launches initialization of the metric cache, so nothing is needed here
  // eslint-disable-next-line no-console
  console.log("Responding to warmup request...");
});

// The Sentry error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use(errorHandler);

module.exports = { app, port };
