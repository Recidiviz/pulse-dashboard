#!/usr/bin/env bash

echo "Refreshing shared-filters link"
rm -r node_modules/shared-filters/
yarn install
cd shared-filters && yarn link
cd ../src && yarn link shared-filters
cd ../server && yarn link shared-filters
