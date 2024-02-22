// const fs = require("fs");
// const path = require('path');
const constants = require('utils/const.js');
const diskService = require('services/disk.js');

// TODO - consider moving these unit conversions to utils/const.js
// const GB_TO_MiB = 953.674;
// const MB_TO_MiB = 0.953674;

const DEFAULT_ADVANCED_SETTINGS = {
  tor: true,
  i2p: false,
  incomingConnections: false,
  dbSyncMode: constants.MONERO_SYNC_MODE,
  dbSyncType: constants.MONERO_SYNC_TYPE,
  dbBlocksPerSync: constants.MONERO_BLOCKS_PER_SYNC,
  upnp: true,
  checkpoint: true,
  publicNode: true,
  moneroAddress: '',
  zmq: false,
  hidePort: true,
  blockNotify: false,
  prune: false,
  mining: false,
  minercpuTarget: 0,
  dbSalvage: false,
  network: constants.MONERO_DEFAULT_NETWORK,
};


function settingsToMultilineConfString(settings) {
  const umbrelMoneroConfig = [];

  // [CHAIN]
  umbrelMoneroConfig.push('# [chain]');
  if (settings.network !== 'mainnet') {
    // Check if set to testnet or stagenet
    if (settings.network === 'testnet') {
      umbrelMoneroConfig.push(`testnet=1`);
    } else if (settings.network === 'stagenet') {
      umbrelMoneroConfig.push(`stagenet=1`);
    }
  }
  umbrelMoneroConfig.push('# RPC ssl settings');
  umbrelMoneroConfig.push(`rpc-ssl=autodetect`);
  umbrelMoneroConfig.push('');

  // bandwidth settings
  umbrelMoneroConfig.push('# Bandwidth settings');
  umbrelMoneroConfig.push('');
  umbrelMoneroConfig.push(`out-peers=64`);
  umbrelMoneroConfig.push(`in-peers=64`);
  umbrelMoneroConfig.push(`limit-rate-up=1048576`);
  umbrelMoneroConfig.push(`limit-rate-down=1048576`);


  // Database Sync Mode
  if (settings.dbSyncMode == 'fast' || settings.dbSyncMode == 'fastest' || settings.dbSyncMode == 'safe') {
    umbrelMoneroConfig.push('');
    umbrelMoneroConfig.push('# Database sync mode');
    umbrelMoneroConfig.push(`db-sync-mode=${settings.dbSyncMode}`);
  }

  // DNS Checkpoints
  if (settings.checkpoint) {
    umbrelMoneroConfig.push('');
    umbrelMoneroConfig.push('# DNS Checkpoints');
    umbrelMoneroConfig.push(`enforce-dns-checkpointing=1`);
  }

  // Prune blockchain
  if (settings.prune) {
    umbrelMoneroConfig.push('');
    umbrelMoneroConfig.push('# Prune blockchain to reduce storage requirements');
    umbrelMoneroConfig.push(`prune-blockchain=1`);
  }

  /*
   * Enable Mining
   */
  if (settings.mining && settings.moneroAddress) {
    umbrelMoneroConfig.push(`bg-mining-enable=1`);
    umbrelMoneroConfig.push(`start-mining=${settings.moneroAddress}`);
    umbrelMoneroConfig.push('');
    umbrelMoneroConfig.push('# Enable mining on CPU');
    umbrelMoneroConfig.push(`bg-mining-miner-target=${settings.minercpuTarget}`);
  }

  // Salvage DB
  if (settings.dbSalvage) {
    umbrelMoneroConfig.push('');
    umbrelMoneroConfig.push('# Salvage the blockchain database if it is corrupted.');
    umbrelMoneroConfig.push('db-salvage=1');
  }


  if (settings.hidePort) {
    umbrelMoneroConfig.push('');
    umbrelMoneroConfig.push('# Hide the port from the peers');
    umbrelMoneroConfig.push(`hide-my-port=1`);
  }

  if (settings.upnp) {
    umbrelMoneroConfig.push(`igd=enabled`);
  }

  umbrelMoneroConfig.push(`p2p-bind-ip=0.0.0.0`);
  umbrelMoneroConfig.push(`p2p-bind-port=${constants.MONERO_P2P_PORT}`);

  // i2p Outbound Connections
  if (settings.i2p) {
    umbrelMoneroConfig.push(`tx-proxy=i2p,${constants.I2P_DAEMON_IP}:${constants.I2P_DAEMON_PORT}`);
  }

  // tor Outbound Connections
  if (settings.tor) {
    umbrelMoneroConfig.push(`tx-proxy=tor,${constants.TOR_PROXY_IP}:${constants.TOR_PROXY_PORT}`);
    // # Tor: add P2P seed nodes for the Tor network
    // # For an up-to-date list of working nodes see ...

    // umbrelMoneroConfig.push(`add-peer=4egylyolrzsk6rskorqvocipdo4tqqoyzxnplbjorns7issmgpoxvtyd.onion:18083`);
    // umbrelMoneroConfig.push(`add-peer=fagmobguo6u4z4b2ghyg3jegcdpmd4qj4wxkhemph5d5q6dltllveqyd.onion:18083`);
    // umbrelMoneroConfig.push(`add-peer=monerokdwzyuml7vfp73fjx5277lzesbrq4nvbl3r3t5ctgodsx34vid.onion:18089`);
    // umbrelMoneroConfig.push(`add-peer=b75obarnhi42p7js7wgzo7v3wtiwcgf4bknrwv6ihatop77jivrtwpid.onion:15892`);
    // umbrelMoneroConfig.push(`add-peer=5nvd6jbefgto3u74nzzdkcsbqgxyzrkk7bz5qupsdqg4gbuj5valiaqd.onion:18083`);
    // umbrelMoneroConfig.push(`add-peer=ozeavjybjbxbvmfcpxzjcn4zklbgohjwwndzenjt44pypvx6jisy74id.onion:18083`);
    // umbrelMoneroConfig.push(`add-peer=xcccrsxi2zknef6zl3sviasqg4xnlkh5k3xqu7ytwkpfli3huyfvsjid.onion:18083`);

    // # Make the seed nodes permanent to fix monerod issue of not maintaining enough connections,
    // # based on this reddit comment:
    // # https://www.reddit.com/r/monerosupport/comments/k3m3x2/comment/ge5ehcy/?utm_source=share&utm_medium=web2x&context=3
    // umbrelMoneroConfig.push(`add-priority-node=4egylyolrzsk6rskorqvocipdo4tqqoyzxnplbjorns7issmgpoxvtyd.onion:18083`);
    // umbrelMoneroConfig.push(`add-priority-node=fagmobguo6u4z4b2ghyg3jegcdpmd4qj4wxkhemph5d5q6dltllveqyd.onion:18083`);
    // umbrelMoneroConfig.push(`add-priority-node=monerokdwzyuml7vfp73fjx5277lzesbrq4nvbl3r3t5ctgodsx34vid.onion:18089`);
    // umbrelMoneroConfig.push(`add-priority-node=b75obarnhi42p7js7wgzo7v3wtiwcgf4bknrwv6ihatop77jivrtwpid.onion:15892`);
    // umbrelMoneroConfig.push(`add-priority-node=5nvd6jbefgto3u74nzzdkcsbqgxyzrkk7bz5qupsdqg4gbuj5valiaqd.onion:18083`);
    // umbrelMoneroConfig.push(`add-priority-node=ozeavjybjbxbvmfcpxzjcn4zklbgohjwwndzenjt44pypvx6jisy74id.onion:18083`);
    // umbrelMoneroConfig.push(`add-priority-node=xcccrsxi2zknef6zl3sviasqg4xnlkh5k3xqu7ytwkpfli3huyfvsjid.onion:18083`);

    // umbrelMoneroConfig.push(`add-exclusive-node=5tymba6faziy36md5ffy42vatbjzlye4vyr3gyz6lcvdfximnvwpmwqd.onion:28083`);
    // umbrelMoneroConfig.push(`add-peer=5tymba6faziy36md5ffy42vatbjzlye4vyr3gyz6lcvdfximnvwpmwqd.onion:28083`);
  }

  // Incoming connections (p2p)
  if (settings.incomingConnections) {
    if (settings.i2p) {
      umbrelMoneroConfig.push(`anonymous-inbound=${constants.MONERO_I2P_HIDDEN_SERVICE}:${constants.I2P_DAEMON_PORT},${constants.MONERO_HOST}:${constants.MONERO_I2P_P2P_PORT},25`);
    }
    if (settings.tor) {
      umbrelMoneroConfig.push(`anonymous-inbound=${constants.MONERO_P2P_HIDDEN_SERVICE}:${constants.MONERO_ONION_P2P_PORT},${constants.MONERO_HOST}:${constants.MONERO_ONION_P2P_PORT},64`);
    }
  }


  umbrelMoneroConfig.push(`rpc-bind-ip=0.0.0.0`);
  umbrelMoneroConfig.push(`rpc-restricted-bind-ip=0.0.0.0`);
  umbrelMoneroConfig.push(`rpc-bind-port=${constants.MONERO_RPC_PORT}`);
  umbrelMoneroConfig.push(`rpc-restricted-bind-port=${constants.MONERO_RESTRICTED_RPC_PORT}`);

  // Public Node
  if (settings.publicNode) {
    umbrelMoneroConfig.push('public-node=1');
    umbrelMoneroConfig.push(`confirm-external-bind=1`);
  }

  if (process.env.APP_BTCPAY_IP && process.env.APP_BTCPAY_PORT) {
    umbrelMoneroConfig.push('');
    umbrelMoneroConfig.push('# Execute command when a block is added or removed from blockchain.');
    umbrelMoneroConfig.push('block-notify="/usr/bin/curl --silent -o /dev/null -X GET http://${constants.APP_BTCPAY_IP}:${constants.APP_BTCPAY_PORT}/monerolikedaemoncallback/block?cryptoCode=xmr&hash=%s"');
  }

  return umbrelMoneroConfig.join('\n');
}

async function getJsonStore() {
  try {
    const jsonStore = await diskService.readJsonFile(constants.JSON_STORE_FILE);
    return {...DEFAULT_ADVANCED_SETTINGS, ...jsonStore};
  } catch (error) {
    return DEFAULT_ADVANCED_SETTINGS;
  }
}

// There's a race condition here if you do two updates in parallel but it's fine for our current use case
async function updateJsonStore(newProps) {
  const jsonStore = await getJsonStore();
  return diskService.writeJsonFile(constants.JSON_STORE_FILE, {
    ...jsonStore,
    ...newProps,
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
    generateMoneroConfig(shouldOverwriteExistingFile, moneroConfig),
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
