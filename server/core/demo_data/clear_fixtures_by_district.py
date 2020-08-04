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
    parser.add_argument('--min', required=False,
                        help='Min district value')
    parser.add_argument('--max', required=False,
                        help='Max district value')

    args = parser.parse_args()

    print('READING IN FIXTURE FILE...')
    with open(args.in_file) as f:
        content = f.readlines()
    content = [x.strip() for x in content]

    print('PROCESSING EACH DATA POINT ROW...')
    new_data_points = []
    for data_point_raw in content:
        data_point = json.loads(data_point_raw)

        if args.min and args.max and args.min >= data_point['district'] <= args.max:
            new_data_points.append(data_point)
        elif args.min and args.min >= data_point['district']:
            new_data_points.append(data_point)
        elif args.max and args.max <= data_point['district']:
            new_data_points.append(data_point)

    print('WRITING RESULTS TO NEW FIXTURE FILE...')
    with open(args.out_file, 'w') as filehandle:
        for data_point in new_data_points:
            filehandle.write('%s\n' % json.dumps(data_point, separators=(',', ':')))

if __name__ == '__main__':
    main()
