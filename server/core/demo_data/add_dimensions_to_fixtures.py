# Recidiviz - a data platform for criminal justice reform
# Copyright (C) 2020 Recidiviz, Inc.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
# =============================================================================

"""Script to add a new dimension to existing fixture data, where the new
dimension divides the data in part. This can be used, for example, to support the rollout of a new
toggle capability that lets us break visualizations down along a new dimension.

Example usage: python add_dimension_to_fixtures.py \
--dimension_label supervision_type -dv PAROLE -dv PROBATION -sp count \
--in_file ftr_referrals_by_race_and_ethnicity_60_days.json \
--out_file ftr_referrals_by_race_and_ethnicity_60_days_updated.json

This call would parse the given input file, and for each row in the file create two rows in the
output file, each with the additional field of `supervision_type`, one with a value of `PAROLE` and
another with a value of `PROBATION`. The `count` field would be used as the "split" column, meaning
that the value of `count` in the input row would be randomly split between the two new rows. For
example, if an input row in the file looked like this:

{"state_code":"US_DEMO","race_or_ethnicity":"BLACK","count":"40"}

Then the output file would contain two rows that might look like this:

{"state_code":"US_DEMO","race_or_ethnicity":"BLACK","supervision_type":"PAROLE","count":"16"}
{"state_code":"US_DEMO","race_or_ethnicity":"BLACK","supervision_type":"PROBATION","count":"24"}

In addition to the `-sp` flag for "split" columns, there is also the `-ra` flag for "random"
columns. This is useful, for example, if you're dealing with a fixture file that includes rates,
which would not just be the sum of the same field for each dimensional breakdown. An example:

python add_dimension_to_fixtures.py --dimension_label district \
-dv district_a -dv district_b -dv district_c -dv ALL -ra average_change \
--in_file average_change_lsir_score_by_month.json \
--out_file average_change_lsir_score_by_month_updated.json

Here, each input row would be split into four output rows, each with a `district` field with values
mapping to the four possible district values, and with an `average_change` field that is random for
each row.

This tool is not perfect. The main deficiency at the moment is in the `-ra` feature: there is no
capability to specify what the random range should be. So before using that flag, you should update
the `randomize_among_dimensions` function below to specify the range you want to generate between.

Another philosophical point to make explicit is that each invocation of the script is totally
separate from all other invocations and does not make use of any context. So if you have two fixture
files, say `supervision_population_by_age_60_days` and `supervision_population_by_gender_60_days`,
which should have dimensional breakdowns that sum to the same overall amounts (the overall size of
the supervision population), this tool will not help achieve that.
"""

import argparse
import json
import random

import numpy as np


def main():
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--in_file', required=True,
                        help='Filename to read from')
    parser.add_argument('--out_file', required=True,
                        help='Filename to write to')
    parser.add_argument('--dimension_label', required=True,
                        help='Label of the new dimension to add')
    parser.add_argument('-dv', '--dimension_values', required=True,
                        help='Values for the dimension to add',
                        action='append')
    parser.add_argument('-sp', '--split_values', required=False,
                        help='Labels of the existing dimensions whose values '
                             'to randomly split between the new dimensions',
                        action='append')
    parser.add_argument('-ra', '--random_values', required=False,
                        help='Labels of the existing dimensions whose values '
                             'to set to random values for each new dimension',
                        action='append')

    args = parser.parse_args()

    print('READING IN FIXTURE FILE...')
    with open(args.in_file) as f:
        content = f.readlines()
    content = [x.strip() for x in content]

    print('PROCESSING EACH DATA POINT ROW...')
    new_data_points = []
    for data_point_raw in content:
        print('BEFORE: ', data_point_raw)

        data_point = json.loads(data_point_raw)

        values_to_update = {}

        if args.split_values:
            for splittable in args.split_values:
                value = int(data_point[splittable])

                splits = split_value_among_dimensions(value,
                                                      args.dimension_values)
                values_to_update[splittable] = splits

        if args.random_values:
            for randomized in args.random_values:
                randoms = randomize_among_dimensions(args.dimension_values)
                values_to_update[randomized] = randoms

        for dimension in args.dimension_values:
            new_data_point = data_point.copy()
            new_data_point[args.dimension_label] = dimension

            for key in values_to_update:
                updated_value = values_to_update[key][dimension]
                new_data_point[key] = updated_value

            print('AFTER:  ', new_data_point)

            new_data_points.append(new_data_point)

    print('WRITING RESULTS TO NEW FIXTURE FILE...')
    with open(args.out_file, 'w') as filehandle:
        for data_point in new_data_points:
            filehandle.write('%s\n' % json.dumps(data_point))


def randomize_among_dimensions(dimension_values):
    randoms = {}
    for value in dimension_values:
        randoms[value] = random.uniform(0.0, 1.0)
    return randoms


def split_value_among_dimensions(total_value, dimension_values):
    num_dimensions = len(dimension_values)

    if total_value == 0:
        pieces = [0 for _ in range(num_dimensions)]
    elif total_value == 1:
        pieces = [1] + [0 for _ in range(num_dimensions - 1)]
    elif total_value == 2:
        if random.randint(1, 2):
            pieces = [2] + [0 for _ in range(num_dimensions - 1)]
        else:
            pieces = [1, 1] + [0 for _ in range(num_dimensions - 2)]
    else:
        to_split = [1] * total_value

        split_points = np.random.choice(total_value - 2,
                                        num_dimensions - 1,
                                        replace=True) + 1
        split_points.sort()

        result = np.split(to_split, split_points)

        pieces = []
        for chunk in result:
            pieces.append(sum(chunk))

    random.shuffle(pieces)
    assert sum(pieces) == total_value

    splits = {}
    for i, piece in enumerate(pieces):
        splits[dimension_values[i]] = str(piece)
    return splits


if __name__ == '__main__':
    main()
