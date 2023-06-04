// const fs = require("fs");
const path = require("path");
const constants = require("utils/const.js");
const diskService = require("services/disk.js");

// TODO - consider moving these unit conversions to utils/const.js
const GB_TO_MiB = 953.674;
const MB_TO_MiB = 0.953674;

const DEFAULT_ADVANCED_SETTINGS = {
  clearnet: true,
  torProxyForClearnet: false,
  tor: false,
  i2p: false,
  incomingConnections: false,
  dbSyncMode: constants.MONERO_SYNC_MODE,
  dbSyncType: constants.MONERO_SYNC_TYPE,
  dbBlocksPerSync: constants.MONERO_BLOCKS_PER_SYNC,
  dnsBlockList: false,
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
    }else{
      umbrelMoneroConfig.push(`testnet=0`)
    }
  }else{
    umbrelMoneroConfig.push(`mainnet`)
  }

  // prune
  if (settings.prune) {
    umbrelMoneroConfig.push("");
    umbrelMoneroConfig.push("# Prune blockchain to reduce storage requirements"); 
    umbrelMoneroConfig.push(`prune=true`);
  }
  
  //Block list
  if (settings.dnsBlockList) {
    umbrelMoneroConfig.push("");
    umbrelMoneroConfig.push("# Block list to use for DNS blocking");
    umbrelMoneroConfig.push(`block-dns=true`);
  }
  //Salvage DB
  if (settings.dbSalvage) {
    umbrelMoneroConfig.push("");
    umbrelMoneroConfig.push('# Salvage the blockchain database if it is corrupted.');
    umbrelMoneroConfig.push('dbSalvage=true');  
  }


  // // clearnet
  // if (settings.clearnet) {
  //   umbrelMoneroConfig.push('# Connect to peers over the clearnet.')
  //   umbrelMoneroConfig.push('onlynet=ipv4');
  //   umbrelMoneroConfig.push('onlynet=ipv6');
  // }
  
  // if (settings.torProxyForClearnet) {
  //   umbrelMoneroConfig.push('# Connect through <ip:port> SOCKS5 proxy.');
  //   umbrelMoneroConfig.push(`proxy=${constants.TOR_PROXY_IP}:${constants.TOR_PROXY_PORT}`); 
  // }

  // // tor
  // if (settings.tor) {
  //   umbrelMoneroConfig.push('# Use separate SOCKS5 proxy <ip:port> to reach peers via Tor hidden services.');
  //   umbrelMoneroConfig.push('onlynet=onion');
  //   umbrelMoneroConfig.push(`onion=${constants.TOR_PROXY_IP}:${constants.TOR_PROXY_PORT}`);
  //   umbrelMoneroConfig.push('# Tor control <ip:port> and password to use when onion listening enabled.');
  //   umbrelMoneroConfig.push(`torcontrol=${constants.TOR_PROXY_IP}:${constants.TOR_PROXY_CONTROL_PORT}`);
  //   umbrelMoneroConfig.push(`torpassword=${constants.TOR_PROXY_CONTROL_PASSWORD}`);
  // }

  // // i2p
  // if (settings.i2p) {
  //   umbrelMoneroConfig.push('# I2P SAM proxy <ip:port> to reach I2P peers.');
  //   umbrelMoneroConfig.push(`i2psam=${constants.I2P_DAEMON_IP}:${constants.I2P_DAEMON_PORT}`);
  //   umbrelMoneroConfig.push('onlynet=i2p');
  // }

  // incoming connections
  // umbrelMoneroConfig.push('# Enable/disable incoming connections from peers.');
  // const listen = settings.incomingConnections ? 1 : 0;
  // umbrelMoneroConfig.push(`listen=1`);
  // umbrelMoneroConfig.push(`listenonion=${listen}`);
  // umbrelMoneroConfig.push(`i2pacceptincoming=${listen}`);

  // umbrelMoneroConfig.push(`# Required to configure Tor control port properly`);
  // umbrelMoneroConfig.push(`[${settings.network}]`);
  // umbrelMoneroConfig.push(`bind=0.0.0.0:18080`);
  // umbrelMoneroConfig.push(`bind=${constants.MONEROD_IP}:18081=onion`);

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
// creates umbrel-monero.conf
function generateUmbrelMoneroConfig(settings) {
  const confString = settingsToMultilineConfString(settings);
  return diskService.writePlainTextFile(constants.UMBREL_MONERO_CONF_FILEPATH, confString);
}

// creates bitmonero.conf with --config-file=umbrel-monero.conf
async function generateMoneroConfig(shouldOverwriteExistingFile = false) {
  const baseName = path.basename(constants.UMBREL_MONERO_CONF_FILEPATH);
  const includeConfString = `# Load additional configuration file, relative to the data directory.\nconfig-file=${baseName}`;

  const fileExists = await diskService.fileExists(constants.MONERO_CONF_FILEPATH);

  // if bitmonero.conf does not exist or should be overwritten, create it with config-file=umbrel-monero.conf
  if (!fileExists || shouldOverwriteExistingFile) {
    return await diskService.writePlainTextFile(constants.MONERO_CONF_FILEPATH, includeConfString);
  }

  const existingConfContents = await diskService.readUtf8File(constants.MONERO_CONF_FILEPATH);
  
  // if bitmonero.conf exists but does not include config-file=umbrel-monero.conf, add config-file=umbrel-monero.conf to the top of the file
  if (!existingConfContents.includes(includeConfString)) {
    return await diskService.writePlainTextFile(constants.MONERO_CONF_FILEPATH, `${includeConfString}\n${existingConfContents}`);
  }

  // do nothing if bitmonero.conf exists and contains config-file=umbrel-monero.conf
}

async function applyMoneroConfig(moneroConfig, shouldOverwriteExistingFile) {
  await Promise.all([
    updateJsonStore(moneroConfig),
    generateUmbrelMoneroConfig(moneroConfig),
    generateMoneroConfig(shouldOverwriteExistingFile),
  ]);
}

async function applyCustomMoneroConfig(moneroConfig) {
  await applyMoneroConfig(moneroConfig, false);
}

async function applyDefaultMoneroConfig() {
  await applyMoneroConfig(DEFAULT_ADVANCED_SETTINGS, true);
}




module.exports = {
  getJsonStore,
  applyCustomMoneroConfig,
  applyDefaultMoneroConfig,
};
