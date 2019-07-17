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

import * as $ from 'jquery';
import Masonry from 'masonry-layout';

export default (function () {
  window.addEventListener('load', () => {
    if ($('.masonry').length > 0) {
      new Masonry('.masonry', {
        itemSelector: '.masonry-item',
        columnWidth: '.masonry-sizer',
        percentPosition: true,
      });
    }
  });

  // Reinitialize masonry inside each panel after the relative tab link is clicked -
  $('a[data-toggle=tab]').each(function () {
    const $this = $(this);

    $this.on('shown.bs.tab', () => {
      if ($('.masonry').length > 0) {
        new Masonry('.masonry', {
          itemSelector: '.masonry-item',
          columnWidth: '.masonry-sizer',
          percentPosition: true,
        });
      }
    });
  });

  // Reinitialize masonry inside each panel after a collapsible accordion is expanded or collapsed
  $('.accordion').each(function () {
    const $this = $(this);

    $this.on('shown.bs.collapse hidden.bs.collapse', () => {
      if ($('.masonry').length > 0) {
        new Masonry('.masonry', {
          itemSelector: '.masonry-item',
          columnWidth: '.masonry-sizer',
          percentPosition: true,
        });
      }
    });
  });
}());
