/*
 * Recidiviz - a platform for tracking granular criminal justice metrics in real time
 * Copyright (C) 2018 Recidiviz, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 * ============================================================================
*/

import * as $ from 'jquery';

require('jquery-ui/themes/base/core.css');
require('jquery-ui/themes/base/menu.css');
require('jquery-ui/themes/base/theme.css');
require('jquery-ui/themes/base/slider.css');
require('jquery-ui/ui/widgets/slider');

// Only import the d3 sub-libraries that we need to minimize impact on bundle size
const d3 = Object.assign({}, require('d3-array'), require('d3-selection'));

function toYears(monthCount) {
    function getPlural(number, word) {
        return number === 1 && word.one || word.other;
    }

    var months = { one: 'month', other: 'months' },
        years = { one: 'year', other: 'years' },
        m = monthCount % 12,
        y = Math.floor(monthCount / 12),
        result = [];

    var inOrAnd = 'in';
    y && result.push('in ' + y + ' ' + getPlural(y, years));
    if (y > 0) {
        inOrAnd = 'and';
    }
    m && result.push(inOrAnd + ' ' + m + ' ' + getPlural(m, months));
    return result.join(', ');
}

function addRecidivismSlider() {
  //placeholder div for jquery slider
  d3.select("#first-chart")
    .append("div")
      .attr("id","sliderDiv")
      .attr("class", "mt2")

  d3.select("#first-chart")
    .append("h1")
      .attr("class", "w-75 tc f4 fw6 f2-ns lh-title measure mt0 pt3 pb0 text-our-gray nunito") //sans-serif
      .attr("id","txtValue");

  //create svg element
  var svgDoc=d3.select("#first-chart").append("svg").attr("viewBox","0 0 180 70").attr("class", "nt3");

  //define an icon store it in svg <defs> elements as a reusable component - this geometry can be generated from Inkscape, Illustrator or similar
  svgDoc.append("defs")
      .append("g")
        .attr("id","iconCustom")
      .append("path")
        .attr("d","M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z");

  //background rectangle
  svgDoc.append("rect").attr("width",180).attr("height",70);

  //specify the number of columns and rows for pictogram layout
  var numCols = 20;
  var numRows = 5;

  //padding for the grid
  var xPadding = 10;
  var yPadding = 15;

  //horizontal and vertical spacing between the icons
  var hBuffer = 8;
  var wBuffer = 8;

  //generate a d3 range for the total number of required elements
  var myIndex=d3.range(numCols*numRows);

  //create group element and create an svg <use> element for each icon
  svgDoc.append("g")
      .attr("id","pictoLayer")
      .selectAll("use")
      .data(myIndex)
      .enter()
      .append("use")
          .attr("xlink:href","#iconCustom")
          .attr("id",function(d)    {
              return "icon"+d;
          })
          .attr("x",function(d) {
              var remainder=d % numCols;//calculates the x position (column number) using modulus
              return xPadding+(remainder*wBuffer);//apply the buffer and return value
          })
          .attr("y",function(d) {
              var whole=Math.floor(d/numCols)//calculates the y position (row number)
              return yPadding+(whole*hBuffer);//apply the buffer and return the value
          })
          .classed("iconPlain",true);

  var textValue = 0;
  var initialSliderValue = 0;

  //create a jquery slider to control the pictogram
  // bjs.gov cumulative recidivism rates across all parameters: 28.2% 43.4% 59.5% 67.8% 73.0% 76.6%
  $( "#sliderDiv" ).slider({
      orientation: "horizontal",
      min: 0,
      max: numCols*numRows,
      value: 0,
      slide: function( event, ui ) {
          var currentSliderValue = ui.value || initialSliderValue;
          currentSliderValue = (currentSliderValue / (100/60)).toFixed();
          var sliderLabelText = toYears(currentSliderValue);

          // if the slider has a value, display it, otherwise display "(drag the slider)"
          if (sliderLabelText) {
               d3.select('#sliderLabel').text(sliderLabelText);
          } else {
              d3.select('#sliderLabel').text("(drag the slider)");
          }

          d3.selectAll("use").attr("class",function (d,i) {
              var rangeMinimum, rangeLength, previousPeople, peopleDelta;

              if (ui.value <= 10) {                   // 6 months, 28.2%
                  rangeMinimum = 0;
                  rangeLength = 10;
                  previousPeople = 0;
                  peopleDelta = 28.2;
              } else if (ui.value <= 20) {            // 1 year, 43.4%
                  rangeMinimum = 10;
                  rangeLength = 10;
                  previousPeople = 28.2;
                  peopleDelta = 15.2;
              } else if (ui.value <= 40) {            // 2 years, 60%
                  rangeMinimum = 20;
                  rangeLength = 20;
                  previousPeople = 43.4;
                  peopleDelta = 16.6;
              } else if (ui.value <= 60) {            // 3 years, 68%
                  rangeMinimum = 40;
                  rangeLength = 20;
                  previousPeople = 60;
                  peopleDelta = 8;
              } else if (ui.value <= 80) {            // 4 years, 73%
                  rangeMinimum = 60;
                  rangeLength = 20;
                  previousPeople = 68;
                  peopleDelta = 5;
              } else if (ui.value <= 100) {           // 5 years, 77%
                  rangeMinimum = 80;
                  rangeLength = 20;
                  previousPeople = 73;
                  peopleDelta = 4;
              }

              var threshold = ((ui.value - rangeMinimum) / (rangeLength / peopleDelta)) + previousPeople;
              textValue = threshold.toFixed();
              if (d < threshold) {
                  return "iconSelected";
              } else {
                  return "iconPlain";
              }
          });

          d3.select("#txtValue").text("..." + textValue + " would be back in prison");
      }
  });
}

export default addRecidivismSlider;
