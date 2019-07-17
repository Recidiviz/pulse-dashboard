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
const secured = require('../src/middleware/secured');

const router = express.Router();

/* GET home page. */
router.get('/', (_, res) => {
  res.render('index');
});

router.get('/snapshots', secured(), (_, res) => {
  res.render('snapshots');
});

router.get('/reincarcerations', secured(), (_, res) => {
  res.render('reincarcerations');
});

router.get('/revocations', secured(), (_, res) => {
  res.render('revocations');
});

router.get('/program-evaluation', secured(), (_, res) => {
  res.render('program-evaluation');
});

module.exports = router;
