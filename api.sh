#!/bin/bash

ROOT="./sources/services"
api=()
api=`./node_modules/node-jq/bin/jq -c -r  '.api | to_entries' ./sources/services/accounts.json`
length=`echo ${api} | ./node_modules/node-jq/bin/jq "length"`
for ((i = 0; i < $length; i++)); do
  entry=`echo ${api} | ./node_modules/node-jq/bin/jq -r .[${i}]`
  file=`echo ${entry} | ./node_modules/node-jq/bin/jq -r  .key`
  file+=".ts"
  path="${ROOT}/${file}"
  method=`echo ${entry} | ./node_modules/node-jq/bin/jq -r .value.row_format`
  echo `${method} | quicktype -l typescript > $path`
done