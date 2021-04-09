#!/bin/bash

# create some dummy auth configs as placeholders for secrets;
# lint tests will fail without them
echo "{ }" >> ./src/auth_config_dev.json
echo "{ }" >> ./src/auth_config_production.json
