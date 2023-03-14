#!/usr/bin/env bash

# function cleanup() {
#     docker-compose down
#     echo "Nuking data dirs..."
#     rm -rf data
# }
# trap cleanup EXIT

docker-compose up &

while true
do
    sleep 10
    echo "Generating a block..."
    # docker-compose exec bitcoind bitcoin-cli -regtest generatetoaddress 1 "bcrt1qs758ursh4q9z627kt3pp5yysm78ddny6txaqgw"
    # replace the above with an identical call for monero 
    docker-compose exec monerod monero-wallet-cli --wallet-file /data/wallets/wallet1 --password "" --testnet --trusted-daemon --daemon-address localhost:18081 --log-file /data/wallets/wallet1.log --log-level 0 --command "transfer 9bc1f7f2c9f5c6c7c8c9d0d1d2d3d4d5d6d7d8d9e0e1e2e3e4e5e6e7e8e9ea 1"
done