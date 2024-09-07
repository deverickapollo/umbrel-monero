<p align="center">
  <a href="https://umbrel.com">
    <img src="https://raw.githubusercontent.com/deverickapollo/umbrel-monero/6c34c9fd4fd98208d1f71172737a2b2a16a651f2/pictures/Monero%20Dashboard.png" alt="Logo">
  </a>
  <h1 align="center">Monero Node for Umbrel</h1>
  <p align="center">
    Run a Monero node on your Umbrel personal server.
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

# Development

## 1. Clone the Repository

Open a terminal and clone the Monero node repository:

```sh
git clone https://github.com/your-repo/monero-node-for-umbrel.git

cd monero-node-for-umbrel
```

## 2. Modify const.js for Local Development

Locate the `const.js` file in your project directory and update the file paths as described. Replace the existing file paths with the following:

```js
const JSON_STORE_FILE = process.env.JSON_STORE_FILE || "./data/monero-config.json";

const MONERO_CONF_FILEPATH = process.env MONERO_CONF_FILE || "./monero/.monero/bitmonero.conf";
```

## 3. Create Necessary Directories and Files

Make sure the directories and files specified in the paths exist. If not, create them:

```sh
mkdir -p ./data
touch ./data/monero-config.json

mkdir -p ./monero/.monero
touch ./monero/.monero/bitmonero.conf
```

## 4. Install Dependencies

Ensure you have Node.js and npm installed. Then install the necessary npm packages:

`npm install`

## 5. Set Environment Variables and Run the App

Set the environment variables and run the app. Replace your-monerod-ip with the IP address of your Monero daemon. For local testing, you can use `127.0.0.1` if you're running the Monero daemon locally.

`MONERO_HOST=your-monerod-ip MONEROD_RPC_PORT=18081 npm run start:all:dev`

Alternatively, if running the Monero daemon on your local machine, use:

`MONERO_HOST=127.0.0.1 MONEROD_RPC_PORT=18081 npm run start:all:dev`

# Troubleshooting Guide

## Cannot find module `umbrel-monero-master/build/services/monerod.js`

This error suggests that the module `monerod.js` is not found in the expected location.

### Solution

1. **Build the Project**

   Make sure you have built the project correctly. Run the build command if necessary:

`   npm run build`

This command should generate the build directory with all necessary artifacts.

## "vue-cli-service: not found"

This error indicates that the `vue-cli-service` command is not available, which is typically used to serve Vue.js applications during development.
Solution

### Install Vue CLI

Ensure that you have Vue CLI installed globally. If not, install it using npm:

`npm install -g @vue/cli`

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

We welcome and appreciate new contributions! Open a PR and I'll be sure to review it asap. For an bugs/feature requests, open an issue and I'll review it as my time allows.

## Acknowledgements

This app is built upon the work done by [Casa](https://github.com/casa) on its open source [API](https://github.com/Casa/Casa-Node-API) and Umbrel [umbrel.com](https://umbrel.com).

---

[![License](https://img.shields.io/github/license/getumbrel/umbrel-bitcoin?color=%235351FB)](https://github.com/getumbrel/umbrel-bitcoin/blob/master/LICENSE.md)

[umbrel.com](https://umbrel.com)
