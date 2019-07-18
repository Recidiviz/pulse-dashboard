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

const path = require('path');
const manifest = require('../manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const titles = {
  // TODO: this whole construct will go away or change significantly if/when we port to React,
  // but these are commented out now that all existing views have been templatized via Pug.

  // 'snapshots': 'Snapshots',
  // 'reincarcerations': 'Reincarcerations',
  // 'revocations': 'Revocations',
  // 'program-evaluation': 'Program Evaluation',
  // '404': '404',
  // '500': '500'
};

module.exports = Object.keys(titles).map(title => new HtmlWebpackPlugin({
  template: path.join(manifest.paths.src, `${title}.html`),
  path: manifest.paths.build,
  filename: `${title}.html`,
  inject: true,
  minify: {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    useShortDoctype: true,
  },
}));
