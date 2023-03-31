const RpcClient = require('monero-javascript');
const camelizeKeys = require('camelize-keys');
const GenUtils = require('monero-javascript/src/main/js/common/GenUtils');
const MonerodError = require('models/errors.js').MonerodError;

const MONEROD_RPC_PORT = process.env.RPC_PORT || 18081; // eslint-disable-line no-magic-numbers, max-len
const MONEROD_HOST = process.env.MONERO_HOST || '127.0.0.1';
const MONEROD_RPC_USER = process.env.RPC_USER;
const MONEROD_RPC_PASSWORD = process.env.RPC_PASSWORD;

const MONEROD_IP = `http://${MONEROD_HOST}:${MONEROD_RPC_PORT}`;

/**
 * RPC/Monero Daemon Resources
 * https://www.getmonero.org/resources/developer-guides/daemon-rpc.html
 * https://moneroecosystem.org/monero-javascript/MoneroDaemon.html
 */

class MoneroDaemon {
  constructor(config) {
    this.config = config;
    (async() => await this.init())();
  }

  async init() {
    try {
      this.daemon = await RpcClient.connectToDaemonRpc({
        uri: MONEROD_IP,
        username: MONEROD_RPC_USER,
        password: MONEROD_RPC_PASSWORD
      });
    } catch (err) {
      throw new MonerodError('Unable to obtain connect to Monero daemon.', err);
    }
  }
}

const daemonController = new MoneroDaemon();

// function promiseify(rpcObj, rpcFn, what) {
//   return new Promise((resolve, reject) => {
//     try {
//       rpcFn.call(rpcObj, (err, info) => {
//         if (err) {
//           reject(new MonerodError(`Unable to obtain ${what}`, err));
//         } else {
//           resolve(camelizeKeys(info, '_'));
//         }
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// function promiseifyParam(rpcObj, rpcFn, param, what) {
//   return new Promise((resolve, reject) => {
//     try {
//       rpcFn.call(rpcObj, param, (err, info) => {
//         if (err) {
//           reject(new MonerodError(`Unable to obtain ${what}`, err));
//         } else {
//           resolve(camelizeKeys(info, '_'));
//         }
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// function promiseifyParamTwo(rpcObj, rpcFn, param1, param2, what) {
//   return new Promise((resolve, reject) => {
//     try {
//       rpcFn.call(rpcObj, param1, param2, (err, info) => {
//         if (err) {
//           reject(new MonerodError(`Unable to obtain ${what}`, err));
//         } else {
//           resolve(camelizeKeys(info, '_'));
//         }
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// }


// function getBestBlockHash() {
//   return promiseify(rpcClient, rpcClient.getLastBlockHeader, 'best block hash');
// }

async function getBlockHash(height) {
  try {
    const heightData = await daemonController.daemon.getBlockHash(height);

    return {result: heightData};
  } catch (err) {
    throw new MonerodError('Unable to obtain getBlockHash from Daemon', err);
  }
}

async function getBlock(hash) {
  try {
    const {state} = await daemonController.daemon.getBlockByHash(hash);

    const block = {
      hash: state.hash,
      height: state.height,
      numTxs: state.numTxs,
      confirmations: 100, // TODO implement,
      time: state.timestamp,
      size: state.size,
      previousblockhash: state.prevHash
    };

    return {result: block};
  } catch (err) {
    throw new MonerodError('Unable to obtain getBlock from Daemon', err);
  }
}

async function getTransaction(txHash) {
  try {
    const hash = await daemonController.daemon.getTx(txHash);

    return {result: hash};
  } catch (err) {
    throw new MonerodError('Unable to obtain getTransaction from Daemon', err);
  }
}

function getSyncPercentage(height, targetHeight) {
  if (targetHeight > height) {
    return Number(((height / targetHeight)).toFixed(4));
  }

  return 1;
}

async function getBlockChainInfo() {
  try {
    const {state: infoState} = await daemonController.daemon.getInfo();

    // TODO: UI should show bytes in pool, not tx #s.  txpoolstats call is currently broken
    // const miningInfo = await daemonController.daemon.getTxPoolStats();

    // console.log(miningInfo.getBytesTotal())

    const info = {
      result: {
        chain: RpcClient.MoneroNetworkType.toString(infoState.networkType),
        blocks: infoState.height,
        headers: infoState.height,
        difficulty: parseInt(infoState.difficulty),
        sizeOnDisk: infoState.databaseSize,
        numOutgoingConnections: infoState.numOutgoingConnections,
        numTxsPool: infoState.numTxsPool,
        verificationprogress: getSyncPercentage(infoState.height, infoState.targetHeight),
        pruned: true, // TODO implement after monero-js implements
        pruneTargetSize: 0 // TODO
      }
    };

    return info;
  } catch (err) {
    throw new MonerodError('Unable to obtain getBlockChainInfo from Daemon', err);
  }
}

async function getPeerInfo() {
  try {
    const peers = await daemonController.daemon.getPeers();

    let mappedPeers = [];

    if (peers && peers.length > 0) {
      mappedPeers = peers.map(({state}) => ({
        addrLocal: state.address,
        type: state.type,
        syncedHeaders: state.height,
        isIncoming: state.isIncoming,
      }));
    }

    return {result: mappedPeers};
  } catch (err) {
    throw new MonerodError('Unable to obtain getPeerInfo from Daemon', err);
  }
}

async function getBlockCount() {
  try {
    const {state} = await daemonController.daemon.getInfo();

    return state.height;
  } catch (err) {
    throw new MonerodError('Unable to obtain getBlockCount from Daemon', err);
  }
}

// TODO implement this
async function getMempoolInfo() {
  try {
    // const info = {
    //   result: {
    //     size: 4524,
    //     bytes: 2071293,
    //     usage: 6141256,
    //     maxmempool: 20000000,
    //     mempoolminfee: 0.00000001,
    //     minrelaytxfee: 0.00000001,
    //   }
    // }

    const pool = await daemonController.daemon.getTxPool();

    return {result: pool};
  } catch (err) {
    throw new MonerodError('Unable to obtain getMempoolInfo from Daemon', err);
  }
}

async function getVersion() {
  try {
    const info = await daemonController.daemon.getInfo();

    return info.state.version;
  } catch (err) {
    throw new MonerodError('Unable to obtain getVersion from Daemon', err);
  }
}

// TODO implement
async function getNetworkInfo() {
  try {
    const {daemon} = daemonController;
    const hardForkInfoData = {
      connections: undefined, // peers
      localAddresses: undefined,
      hardForkInfo: undefined,
      blockHeader: undefined,
      blockHeight: undefined,
      version: undefined,
      height: undefined,
      difficulty: undefined,
      hashrate: undefined,
      tx_count: undefined,
      fee_per_kb: undefined,
      fee_address: undefined,
      fee_amount: undefined
    };

    const blah = await daemon.getPeers();

    hardForkInfoData.connections = blah ? blah.length : 0;

    // const hardForkInfo = daemonController.daemon.getInfo();
    // const blockHeader = daemonController.daemon.getLastBlockHeader();
    // const blockHeight = blockHeader.height;
    // const version = hardForkInfo.version;
    // const height = blockHeight;
    // const difficulty = hardForkInfo.difficulty;
    // const hashrate = hardForkInfo.difficulty / blockHeader.timestamp;
    // const tx_count = hardForkInfo.tx_count;
    // const fee_per_kb = hardForkInfo.fee_address;
    // const fee_address = hardForkInfo.fee_address;
    // const fee_amount = hardForkInfo.fee_amount;
    return {
      result: {
        hardForkInfoData
      }
    };
  } catch (err) {
    throw new MonerodError('Unable to obtain getNetworkInfo from Daemon', err);
  }
}

// Unused function
// function getMiningInfo() {
//   try {
//     const blockHeader = daemonController.daemon.getLastBlockHeader();

//     // const blockHeight = blockHeader.height;
//     // const difficulty = blockHeader.difficulty;
//     // const hashrate = difficulty / blockHeader.timestamp;
//     // const tx_count = blockHeader.tx_count;
//     // const fee_per_kb = blockHeader.fee_per_kb;
//     // const fee_address = blockHeader.fee_address;
//     // const fee_amount = blockHeader.fee_amount;
//     return {result: {
//       networkhashps: parseInt(blockHeader.difficulty) / 120
//     }};
//   } catch (err) {
//     throw new MonerodError('Unable to obtain getMiningInfo from Daemon', err);
//   }
// }

async function stop() {
  await daemonController.daemon.stop();
}

module.exports = {
  getBlockHash,
  getBlock,
  getTransaction,
  getBlockChainInfo,
  getBlockCount,
  getPeerInfo,
  getMempoolInfo,
  getNetworkInfo,
  getVersion,
  stop,
};
