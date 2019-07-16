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
 * + @Common Loaders
 * + @Merging Production Loaders
 * + @Merging Development Loaders
 * + @Exporting Module
 */


// ---------------------
// @Loading Dependencies
// ---------------------

const
  manifest          = require('../manifest'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');


// ---------------
// @Common Loaders
// ---------------

let rule = {};

const loaders = [
  {
    loader: 'css-loader',
    options: {
      sourceMap : manifest.IS_DEVELOPMENT,
      minimize  : manifest.IS_PRODUCTION,
    },
  },
];


// ---------------------------
// @Merging Production Loaders
// ---------------------------

if (manifest.IS_PRODUCTION) {
  rule = {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
      use: loaders,
    }),
  };
}


// ----------------------------
// @Merging Development Loaders
// ----------------------------

if (manifest.IS_DEVELOPMENT) {
  rule = {
    test: /\.css$/,
    use: [{
      loader: 'style-loader',
    }].concat(loaders),
  };
}


// -----------------
// @Exporting Module
// -----------------

module.exports = rule;
