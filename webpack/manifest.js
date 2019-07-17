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

// ------------------
// @Table of Contents
// ------------------

/**
 * + @Loading Dependencies
 * + @Environment Holders
 * + @Utils
 * + @App Paths
 * + @Output Files Names
 * + @Entries Files Names
 * + @Exporting Module
 */


// ---------------------
// @Loading Dependencies
// ---------------------

const path = require('path');


// --------------------
// @Environment Holders
// --------------------

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_DEVELOPMENT = NODE_ENV === 'development';
const IS_PRODUCTION = NODE_ENV === 'production';


// ------
// @Utils
// ------

const
  dir = src => path.join(__dirname, src);


// ----------
// @App Paths
// ----------

const
  paths = {
    src: dir('../src'),
    build: dir('../build'),
  };


// -------------------
// @Output Files Names
// -------------------

const
  outputFiles = {
    bundle: 'bundle.js',
    vendor: 'vendor.js',
    css: 'style.css',
  };


// --------------------
// @Entries Files Names
// --------------------

const
  entries = {
    js: 'index.js',
  };


// -----------------
// @Exporting Module
// -----------------

module.exports = {
  paths,
  outputFiles,
  entries,
  NODE_ENV,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
};
