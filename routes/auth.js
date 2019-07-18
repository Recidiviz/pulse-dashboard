// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2018 Recidiviz, Inc.
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

const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');
const util = require('util');
const querystring = require('querystring');

const router = express.Router();

dotenv.config();

// Perform the login, after login Auth0 will redirect to callback
router.get('/login', passport.authenticate('auth0', {
  scope: 'openid email profile',
}), (req, res) => {
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user) => {
    if (err) {
      next(err);
      return;
    }
    if (!user) {
      res.redirect('/login');
      return;
    }
    req.logIn(user, (error) => {
      if (error) {
        next(error);
        return;
      }
      const { returnTo } = req.session;
      delete req.session.returnTo;
      res.redirect(returnTo || '/snapshots');
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();

  let returnTo = `${req.protocol}://${req.hostname}`;
  const port = req.connection.localPort;
  // Only redirect back to a specific port locally, i.e. localhost:3000.
  // In GAE, the connection local port is not generally accessible so this breaks.
  if (process.env.NODE_ENV !== 'production' && port !== undefined && port !== 80 && port !== 443) {
    returnTo += `:${port}`;
  }
  const logoutURL = new URL(util.format('https://%s/logout', process.env.AUTH0_DOMAIN));
  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo,
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

module.exports = router;
