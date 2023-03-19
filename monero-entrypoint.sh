#!/opt/homebrew/bin/bash bash

CORE_PORT=18080
CORE_RPCPORT=18089

arguments=""
for env in "${!CORE_@}"
do
  value=${!env}
  uppercase_flag=${env#CORE_}
  lowercase_flag=${uppercase_flag,,}
  arguments="${arguments} -${lowercase_flag,,}=${!env}"
done
echo $arguments
# -port=18080 -rpcport=18089