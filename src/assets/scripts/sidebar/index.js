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

export default (function () {
  // Sidebar links
  $('.sidebar .sidebar-menu li a').on('click', function () {
    const $this = $(this);

    if ($this.parent().hasClass('open')) {
      $this
        .parent()
        .children('.dropdown-menu')
        .slideUp(200, () => {
          $this.parent().removeClass('open');
        });
    } else {
      $this
        .parent()
        .parent()
        .children('li.open')
        .children('.dropdown-menu')
        .slideUp(200);

      $this
        .parent()
        .parent()
        .children('li.open')
        .children('a')
        .removeClass('open');

      $this
        .parent()
        .parent()
        .children('li.open')
        .removeClass('open');

      $this
        .parent()
        .children('.dropdown-menu')
        .slideDown(200, () => {
          $this.parent().addClass('open');
        });
    }
  });

  // Sidebar Activity Class
  const sidebarLinks = $('.sidebar').find('.sidebar-link');

  sidebarLinks
    .each((index, el) => {
      $(el).removeClass('active');
    })
    .filter(function () {
      const href = $(this).attr('href');
      const pattern = href[0] === '/' ? href.substr(1) : href;
      return pattern === (window.location.pathname).substr(1);
    })
    .addClass('active');

  // ٍSidebar Toggle
  $('.sidebar-toggle').on('click', (e) => {
    $('.app').toggleClass('is-collapsed');
    e.preventDefault();
  });

  /**
   * Wait untill sidebar fully toggled (animated in/out)
   * then trigger window resize event in order to recalculate
   * masonry layout widths and gutters.
   */
  $('#sidebar-toggle').click((e) => {
    e.preventDefault();
    setTimeout(() => {
      window.dispatchEvent(window.EVENT);
    }, 300);
  });
}());
