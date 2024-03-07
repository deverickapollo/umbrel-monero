<p align="center">
  <a href="https://umbrel.com">
    <img src="https://raw.githubusercontent.com/deverickapollo/umbrel-monero/6c34c9fd4fd98208d1f71172737a2b2a16a651f2/pictures/Monero%20Dashboard.png" alt="Logo">
  </a>
  <h1 align="center">Monero Node for Umbrel</h1>
  <p align="center">
    Run a Monero node on your Umbrel personal server. An unofficial app by @deverickapollo and @CryptoGrampy
    <br />
    <a href="https://getmonero.org"><strong>getmonero.org »</strong></a>
    <br />
    <br />
    <a href="https://twitter.com/monero">
      <img src="https://img.shields.io/twitter/follow/Monero?style=social" />
    </a>
    <a href="https://telegram.me/monero">
      <img src="https://img.shields.io/badge/community-chat-%235351FB">
    </a>
    <a href="https://reddit.com/r/Monero">
      <img src="https://img.shields.io/reddit/subreddit-subscribers/monero?style=social">
    </a>
    <a href="https://github.com/monero-project/monero/issues">
      <img src="https://img.shields.io/badge/community-forum-%235351FB">
    </a>
  </p>
</p>

### Development

- For local testing, you need to set the JSON_STORE_FILE and MONERO_CONF_FILE location in const.js or as an environment variable.  For const.js, you can use the following:
  - Replace: 
    - JSON_STORE_FILE: process.env.JSON_STORE_FILE || "/data/monero-config.json",
    - MONERO_CONF_FILEPATH: process.env.MONERO_CONF_FILE || "/monero/.monero/bitmonero.conf",
  - with:
    - JSON_STORE_FILE: process.env.JSON_STORE_FILE || "./data/monero-config.json",
    - MONERO_CONF_FILEPATH: process.env.MONERO_CONF_FILE || "./monero/.monero/bitmonero.conf",
  - then run:
    - MONERO_HOST=your-monerod-ip MONEROD_RPC_PORT=18081 npm run start:all:dev
    - MONERO_HOST=127.0.0.1 MONEROD_RPC_PORT=18081 npm run start:all:dev
  
### Production
- npm run start

#### Docker

To build:
- docker buildx build --platform linux/arm64 -f ./Dockerfile --tag umbrel-monero/monero-frontend:v1.0.0 --load .
- docker-compose up 
  
## Getting started

This app can be installed in one click via the Umbrel Community App Store.

## Copying blockchain from another node
  1. SSH into Umbrel node and input password : `ssh umbrel@umbrel.local`
  2. Stop Monero app: `sudo /home/umbrel/umbrel/scripts/app stop meganero-monero`
  3. Archive/Delete contents of `/home/umbrel/umbrel/app-data/meganero-monero/data/monero/lmdb`, i.e.: `rm data.mdb lock.mdb` 
  4. From device with copy of Monero blockchain, go to the data directory for the monero chain then copy the contents to the lmdb directory:
  	`scp -r . umbrel@umbrel.local:/home/umbrel/umbrel/app-data/meganero-monero/data/monero/lmdb`
  5. Once you're done moving files over, start up the app again
  	`sudo /home/umbrel/umbrel/scripts/app start meganero-monero`

## Updating
1. `sudo ./scripts/app stop meganero-monero`
2. `sudo docker container prune`
3. `docker images`
4. Remove Old Image
   1. **Remove Specific Docker Image:** 
   	1. To remove a specific image, you can use:
   		`docker rmi [IMAGE ID or REPOSITORY:TAG]`
   		For instance, if the image ID is `abcd1234`, you can remove it using:
   		`docker rmi abcd1234`
   		Or if the image's repository and tag are `my_image:latest`, you can remove it using:
   		`docker rmi my_image:latest`
   2. **Remove All Docker Images:** 
   	1. `sudo docker image prune -a`
5. `sudo docker pull deverickapollo/umbrel-monero:dev-refactor-settings` - Make sure to set the tag to the version you want to pull. We recommend using the master branch.
6. `sudo ./scripts/app start meganero-monero`

## Contributing

We welcome and appreciate new contributions!  Open a PR and I'll be sure to review it asap.  For an bugs/feature requests,  open an issue and I'll review it as my time allows. 


## Acknowledgements

This app is built upon the work done by [Casa](https://github.com/casa) on its open source [API](https://github.com/Casa/Casa-Node-API) and Umbrel [umbrel.com](https://umbrel.com).

---

[![License](https://img.shields.io/github/license/getumbrel/umbrel-bitcoin?color=%235351FB)](https://github.com/getumbrel/umbrel-bitcoin/blob/master/LICENSE.md)

[umbrel.com](https://umbrel.com)
