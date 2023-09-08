// const fs = require("fs");
const path = require("path");
const constants = require("utils/const.js");
const diskService = require("services/disk.js");

// TODO - consider moving these unit conversions to utils/const.js
const GB_TO_MiB = 953.674;
const MB_TO_MiB = 0.953674;

const DEFAULT_ADVANCED_SETTINGS = {
  tor: true,
  i2p: false,
  incomingConnections: false,
  dbSyncMode: constants.MONERO_SYNC_MODE,
  dbSyncType: constants.MONERO_SYNC_TYPE,
  dbBlocksPerSync: constants.MONERO_BLOCKS_PER_SYNC,
  dnsBlockList: false,
  confirmExternalBind: true,
  hidePort: false,
  prune: false,
  dbSalvage: false,
  network: constants.MONERO_DEFAULT_NETWORK
}


function settingsToMultilineConfString(settings) {
  const umbrelMoneroConfig = [];

  // [CHAIN]
  umbrelMoneroConfig.push("# [chain]"); 
  if (settings.network !== 'mainnet') {
    //Check if set to testnet or stagenet
    if (settings.network === 'testnet') {
      umbrelMoneroConfig.push(`testnet=1`);
    } else if (settings.network === 'stagenet') {
      umbrelMoneroConfig.push(`stagenet=1`);
    }
  }

  // prune
  if (settings.prune) {
    umbrelMoneroConfig.push("");
    umbrelMoneroConfig.push("# Prune blockchain to reduce storage requirements"); 
    umbrelMoneroConfig.push(`prune-blockchain=1`);
  }
  
  if (settings.dbSyncMode == 'fast' || settings.dbSyncMode == 'fastest' || settings.dbSyncMode == "safe"){
    umbrelMoneroConfig.push("");
    umbrelMoneroConfig.push("# Database sync mode"); 
    umbrelMoneroConfig.push(`db-sync-mode=${settings.dbSyncMode}`);
  }
  
  //Block list
  if (settings.dnsBlockList) {
    umbrelMoneroConfig.push("");
    umbrelMoneroConfig.push("# Block list to use for DNS blocking");
    umbrelMoneroConfig.push(`enable-dns-blocklist=1`);
  }
  //Salvage DB
  if (settings.dbSalvage) {
    umbrelMoneroConfig.push("");
    umbrelMoneroConfig.push('# Salvage the blockchain database if it is corrupted.');
    umbrelMoneroConfig.push('db-salvage=1');  
  }

  // i2p
  if (settings.i2p) {
    umbrelMoneroConfig.push("");
    umbrelMoneroConfig.push('# I2P SAM proxy <ip:port> to reach I2P peers.');
    umbrelMoneroConfig.push(`tx-proxy=i2p,${constants.I2P_DAEMON_IP}:${constants.I2P_DAEMON_PORT}`);
  }

  // Incoming connections (p2p)
  if (settings.incomingConnections) {
    umbrelMoneroConfig.push("");
    umbrelMoneroConfig.push("# Enable/disable incoming connections from peers.");
    umbrelMoneroConfig.push('public-node=1')
    if(settings.i2p){
      umbrelMoneroConfig.push(`anonymous-inbound=${constants.I2P_DAEMON_IP}:${constants.I2P_DAEMON_PORT}`);
    }
    if(settings.tor){
      umbrelMoneroConfig.push(`p2p-bind-ip=0.0.0.0`);
      umbrelMoneroConfig.push(`anonymous-inbound=${constants.MONERO_P2P_HIDDEN_SERVICE},${MONERO_HOST}:${constants.MONERO_P2P_PORT},25`);
    }
  }else{
    umbrelMoneroConfig.push('no-igd=1');
    umbrelMoneroConfig.push('hide-my-port=1');
  }

  return umbrelMoneroConfig.join('\n');
}

async function getJsonStore() {
  try {
    const jsonStore = await diskService.readJsonFile(constants.JSON_STORE_FILE);
    return { ...DEFAULT_ADVANCED_SETTINGS, ...jsonStore };
  } catch (error) {
    return DEFAULT_ADVANCED_SETTINGS;
  }
}

// There's a race condition here if you do two updates in parallel but it's fine for our current use case
async function updateJsonStore(newProps) {
  const jsonStore = await getJsonStore();
  return diskService.writeJsonFile(constants.JSON_STORE_FILE, {
    ...jsonStore,
    ...newProps
  });
}

// creates bitmonero.conf
async function generateMoneroConfig(shouldOverwriteExistingFile = true, setting = DEFAULT_ADVANCED_SETTINGS) {
  const fileExists = await diskService.fileExists(constants.MONERO_CONF_FILEPATH);

  // if bitmonero.conf does not exist or should be overwritten, create it with config-file=umbrel-monero.conf
  if (!fileExists || shouldOverwriteExistingFile) {
    const confString = settingsToMultilineConfString(setting);
    return diskService.writePlainTextFile(constants.MONERO_CONF_FILEPATH, confString);
  }
  // INVESTIGATE WHETHER THIS IS NEEDED - Comment out for now
  // if bitmonero.conf exists but does not include config-file=umbrel-monero.conf, add config-file=umbrel-monero.conf to the top of the file
  // const existingConfContents = await diskService.readUtf8File(constants.MONERO_CONF_FILEPATH);
  // if (!existingConfContents.includes(includeConfString)) {
  //   return await diskService.writePlainTextFile(constants.MONERO_CONF_FILEPATH, `${includeConfString}\n${existingConfContents}`);
  // }

}

async function applyMoneroConfig(moneroConfig, shouldOverwriteExistingFile = true) {
  await Promise.all([
    updateJsonStore(moneroConfig),
    generateMoneroConfig(shouldOverwriteExistingFile,moneroConfig),
  ]);
}

async function applyCustomMoneroConfig(moneroConfig, shouldOverwriteExistingFile = true) {
  await applyMoneroConfig(moneroConfig, shouldOverwriteExistingFile);
}

async function applyDefaultMoneroConfig() {
  await applyMoneroConfig(DEFAULT_ADVANCED_SETTINGS, true);
}




module.exports = {
  getJsonStore,
  applyCustomMoneroConfig,
  applyDefaultMoneroConfig,
};
