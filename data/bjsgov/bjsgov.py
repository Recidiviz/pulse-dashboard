#!/usr/bin/python


# Recidiviz - a platform for tracking granular recidivism metrics in real time
# Copyright (C) 2018 Recidiviz, Inc.
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
import re
import requests
from bs4 import BeautifulSoup
from itertools import product
from reppy.robots import Robots
from time import sleep

FLOATS = re.compile(r"[-+]?\d*\.\d+|\d+")
TABLE_REQUEST_URL = 'https://www.bjs.gov/recidivism_2005_arrest/templates/RunAnalysis.cfm'

PARAMETER_KEYS = {
    "age": {
        "24 or younger": 1,
        "25 to 29": 2,
        "30 to 34": 3,
        "35 to 39": 4,
        "40 or older": 5,
        "Missing": 9
    },
    "sex": {
        "Male": 1,
        "Female": 2,
        "Missing": 9
    },
    "race": {
        "White": 1,
        "Black/African American": 2,
        "Hispanic/Latino": 3,
        "Other": 4,
        "Missing": 9
    },
    "Arrest": {
        "4 or fewer": 1,
        "5 to 9": 2,
        "10 or more": 3
    },
    "offense": {
        "Homicide": 1,
        "Rape/Sexual Assault": 2,
        "Robbery": 3,
        "Assault": 4,
        "Other Violent Crime": 5,
        "Burglary": 6,
        "Larceny and Motor Vehicle Theft": 7,
        "Fraud/Forgery": 8,
        "Other Property": 9,
        "Drug Trafficking": 10,
        "Drug Possession": 11,
        "Other Drug": 12,
        "Weapons": 13,
        "DUI": 14,
        "Other Public-Order": 15
    }
}


def read_results(output_filename):
    """
    Reads the initial output file to see if there are any existing results, as json, that we can skip processing for.
    :param output_filename: the output file
    :return: results as a dictionary if they exist, or a new dictionary if the file is empty
    """
    print 'Checking given file for existing results...'
    with open(output_filename, 'r') as output_file:
        try:
            existing_results = json.load(output_file)
            print 'Found existing results. Skipping previous work.'
            return existing_results
        except ValueError:
            print 'No existing results in file. Starting fresh.'
            return {}


def write_results(results, output_filename):
    """
    Writes the given results to the output file as json.
    :param results: the results as a dictionary
    :param output_filename: the file to write to
    :return: None
    """
    with open(output_filename, 'w') as output_file:
        json.dump(results, output_file)


def to_key(request_key, request_code):
    """
    Performs a reverse lookup of the given request code to find the human-readable key,
    e.g. to_key('age', 1) => '24 or younger'
    :param request_key: the type of request key
    :param request_code: the requested code
    :return: the human-readable key for use in the results dictionary
    """
    parameters = PARAMETER_KEYS[request_key]
    for key, value in parameters.iteritems():
        if value == request_code:
            return key


def update_with(all_results, new_results, request):
    """
    Updates the in-progress results dictionary, in place, with the given, new results from the request.
    :param all_results: the in-progress results dictionary
    :param new_results: the new results to add
    :param request: the request that yielded the new results
    :return: None
    """
    age = to_key('age', request['age'])
    sex = to_key('sex', request['sex'])
    race = to_key('race', request['race'])
    arrest = to_key('Arrest', request['Arrest'])
    offense = to_key('offense', request['offense'])

    if age not in all_results:
        all_results[age] = {}
    if sex not in all_results[age]:
        all_results[age][sex] = {}
    if race not in all_results[age][sex]:
        all_results[age][sex][race] = {}
    if arrest not in all_results[age][sex][race]:
        all_results[age][sex][race][arrest] = {}
    all_results[age][sex][race][arrest][offense] = new_results


def parameter_permutations():
    """
    Produces all permutations of queries where a single parameter is chosen from each set of
    available parameters, e.g. demographics.age, demographics.sex, and sentence.offense.
    :return: a list of permutation tuples of queries with a single parameter from each set
    """
    all_parameter_sets = []

    for key, parameter_map in PARAMETER_KEYS.iteritems():
        parameters = [(key, value) for _k, value in parameter_map.items()]
        all_parameter_sets.append(parameters)

    return list(product(*all_parameter_sets))


def filter_previous_requests(all_results, query_requests):
    """
    Filters out requests that were already analyzed in the given results.
    :param all_results: a list of analyzed results
    :param query_requests: a list of requests already performed in the results
    :return: a list of not yet analyzed requests
    """
    filtered_requests = []
    for request in query_requests:
        age = to_key('age', request['age'])
        sex = to_key('sex', request['sex'])
        race = to_key('race', request['race'])
        arrest = to_key('Arrest', request['Arrest'])
        offense = to_key('offense', request['offense'])
        try:
            if all_results[age][sex][race][arrest][offense]:
                pass
        except KeyError:
            filtered_requests.append(request)

    original_total = len(query_requests)
    filtered_total = len(filtered_requests)
    if filtered_total < original_total:
        print 'Found {} requests already analyzed in output file, skipping.'.format(original_total - filtered_total)
    return filtered_requests


def to_requests(permutations):
    """
    Transforms tuples of parameter permutations into request payload maps.
    :param permutations: a list of parameter permutation tuples
    :return: a list of dictionaries ready for request
    """
    def with_obj_analysis(permutation):
        permutation['objAnalysis'] = 'Table'
        return permutation

    return [with_obj_analysis(dict(permutation_tuple)) for permutation_tuple in permutations]


def to_time(div):
    """
    Parses the time label from a particular result div in the response.
    :param div: a div containing a query result
    :return: the time label, e.g. '6 months' or '1 year', as a string
    """
    return str(div['title'].split(',')[2].strip())


def to_percent(div):
    """
    Parses the arrest percentage text from a particular result div in the response.
    :param div: a div containing a query result
    :return: the arrest percentage, e.g. '42.5%', as a string
    """
    floats = FLOATS.findall(div.get_text(strip=True))
    if len(floats) > 1:
        raise ValueError('Found multiple floats in result div: {}'.format(floats))
    elif floats[0] < 0:
        raise ValueError('Received negative percentage in result div: {}'.format(floats[0]))
    return float(floats[0])


def to_results(html_response):
    """
    Parses the full results of the query from the returned html, namely the arrest
    percentage mapped to the time since release.
    :param html_response: the html response from bjs.gov
    :return: a dictionary mapping arrest percentage to time since release
    """
    soup = BeautifulSoup(html_response, 'html.parser')
    results = soup.find_all('div', class_='percent')
    return {to_time(div): to_percent(div) for div in results}


def query_with(request):
    """
    Queries bjs.gov with the given request as form data and returns the full response object.
    :param request: the request to bjs.gov with the given parameter dictionary
    :return: the full response object
    """
    return requests.post(TABLE_REQUEST_URL, request)


def main():
    """
    Main control flow for finding recidivism rates over time by various parameters via bjs.gov.

    Note that the crawl-delay on the bjs robots.txt is set to 45 seconds as of the time of this writing, which makes
    for a lengthy crawl depending on how many requests you want to make.

    Determines the set of requests to issue against bjs.gov, checks the desired output file to see if any previous
    results already exist to avoid duplicate effort, issues each request in serial, parses each response (which come
    back as HTML) to find recidivism rates, assembles rates into tree structure in json, occasionally writes
    in-progress results out to disk as a checkpoint, and performs one last write to disk and stdout on completion.

    To be safe, this only operates on files in 'r+' mode instead of 'w+' to avoid the potential loss of prior results.
    For this reason, the output file will not be created if it does not yet exist.
    :return: None
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', help='filename to dump output to', required=True)
    parser.add_argument('--user_agent', help='username to query bjs.gov with', required=True)
    args = parser.parse_args()
    output_filename = args.output
    user_agent = args.user_agent

    robots = Robots.fetch('https://www.bjs.gov/robots.txt')
    delay_seconds = robots.agent(user_agent).delay

    permutations = parameter_permutations()
    all_results = read_results(output_filename)
    query_requests = filter_previous_requests(all_results, to_requests(permutations))
    number_requests = len(query_requests)

    try:
        for index, request in enumerate(query_requests):
            one_based_index = index + 1
            print '{}/{} - Querying with {}...'.format(one_based_index, number_requests, request)
            response = query_with(request)
            new_results = to_results(response.text)
            print '{}/{} - Done.'.format(one_based_index, number_requests)

            update_with(all_results, new_results, request)

            if one_based_index % 10 == 0:
                print '{}/{} - Writing current progress to file...'.format(one_based_index, number_requests)
                write_results(all_results, output_filename)

            if one_based_index < number_requests:
                print 'Delaying for {} seconds...'.format(delay_seconds)
                sleep(delay_seconds)

        print json.dumps(all_results), '\n==========\n'
        print 'All requests complete! Writing final results to stdout and file...'
        write_results(all_results, output_filename)
        print 'Analysis complete.'

    except Exception as exception:
        print 'Encountered exception during analysis: {}'.format(exception)
        print 'Commencing emergency dump to stdout and file...'
        print json.dumps(all_results), '\n==========\n'
        write_results(all_results, output_filename)
        print 'Attempting analysis with the same output file will pick up from where previous runs left off.'


if __name__ == "__main__":
    main()
