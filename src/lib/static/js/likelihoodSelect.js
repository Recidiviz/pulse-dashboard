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

// TODO: remove jQuery dependency
import * as $ from 'jquery';

export default function likelihoodSelect (form) {
    var age, race, sex, history, offense;
    var fields = form.fields;
    fields.forEach(function (field) {
        var value = field.elOriginal.value;
        switch (field.elOriginal.name) {
            case 'age':
                age = value;
                break;
            case 'race':
                race = value;
                break;
            case 'sex':
                sex = value;
                break;
            case 'history':
                history = value;
                break;
            case 'offense':
                offense = value;
                break;
        }
    });

// TODO: remove jQuery dependency
    $.getJSON( "../data/bjsgov/single_parameter_permutations.json", function( json ) {
        var cumulativeRecidivismRates = json[age][sex][race][history][offense];

        if ($.isEmptyObject(cumulativeRecidivismRates)) {
            $('div#nl-form-likelihood-results').text("unknown");
            return;
        }

        var timeUntilLikelihood = "more than 5 years";
        ['6 months', '1 Year', '2 Years', '3 Years', '4 Years', '5 Years'].some(function (time) {
            if (cumulativeRecidivismRates[time] > 50) {
                timeUntilLikelihood = time.toLowerCase();
                return true;
            }
        });

// TODO: remove jQuery dependency
        $('div#nl-form-likelihood-results').text(timeUntilLikelihood);
    });
};
