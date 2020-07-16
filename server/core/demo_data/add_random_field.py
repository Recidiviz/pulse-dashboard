# add_random_field.py

import argparse
import json
import random

def main():
    with open("revocations_matrix_distribution_by_race.json") as f:
        content = f.readlines()
    content = [x.strip() for x in content]

    new_data_points = []
    for data_point_raw in content:
        data_point = json.loads(data_point_raw)

        new_data_point = data_point.copy()
        del new_data_point['state_code']
        new_data_points.append(new_data_point)

    with open("revocations_matrix_distribution_by_race_updated.json", 'w') as filehandle:
        for data_point in new_data_points:
            filehandle.write('%s\n' % json.dumps(data_point, separators=(',', ':')))


if __name__ == '__main__':
    main()