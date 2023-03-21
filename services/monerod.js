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
    this.daemon = await RpcClient.connectToDaemonRpc({
      uri: MONEROD_IP,
      username: MONEROD_RPC_USER,
      password: MONEROD_RPC_PASSWORD
    });
  }
}

const genUtils = new RpcClient.GenUtils();

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
  const heightData = await daemonController.daemon.getBlockHash(height);

  return {result: heightData};
}

async function getBlock(hash) {
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
}

async function getTransaction(txHash) {
  const hash = await daemonController.daemon.getTx(txHash);

  return {result: hash};
}

function getSyncPercentage(height, targetHeight) {
  if (targetHeight > height) {
    return Number(((height / targetHeight)).toFixed(4));
  }

  return 1;
}

async function getBlockChainInfo() {
  const {state} = await daemonController.daemon.getInfo();

  const info = {
    result: {
      chain: RpcClient.MoneroNetworkType.toString(state.networkType),
      blocks: state.height,
      headers: state.height,
      difficulty: parseInt(state.difficulty),
      sizeOnDisk: state.databaseSize,
      verificationprogress: getSyncPercentage(state.height, state.targetHeight),
      pruned: false, // TODO implement after monero-js implements
      pruneTargetSize: 0 // TODO
    }
  };

  return info;
}

async function getPeerInfo() {
  // const peerInfo = {
  //   result: {
  //     [{
  //       syncedHeaders,
  //       isIncoming,
  //       addrlocal
  //     }]
  //   }
  // }

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
}

async function getBlockCount() {
  const {state} = await daemonController.daemon.getInfo();

  return state.height;
}

async function getMempoolInfo() {
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

  // TODO implement this


  return {result: pool};
}

async function getVersion() {
  const info = await daemonController.daemon.getInfo();

  return info.state.version;
}

// TODO implement
async function getNetworkInfo() {
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
}

function getMiningInfo() {
  const blockHeader = daemonController.daemon.getLastBlockHeader();

  // const blockHeight = blockHeader.height;
  // const difficulty = blockHeader.difficulty;
  // const hashrate = difficulty / blockHeader.timestamp;
  // const tx_count = blockHeader.tx_count;
  // const fee_per_kb = blockHeader.fee_per_kb;
  // const fee_address = blockHeader.fee_address;
  // const fee_amount = blockHeader.fee_amount;

  return {result: {
    networkhashps: blockHeader.difficulty
  }};
}
async function help() {
  // TODO: missing from the library, but can add it not sure how to package.
  // rpc.uptime(function (err, res) {
  //     if (err) {
  //         deferred.reject({status: 'offline'});
  //     } else {
  //         deferred.resolve({status: 'online'});
  //     }
  // });
  await daemonController.daemon.getInfo();
}

async function stop() {
  await daemonController.daemon.stop();
}

module.exports = {
  getMiningInfo,
  getBlockHash,
  getBlock,
  getTransaction,
  getBlockChainInfo,
  getBlockCount,
  getPeerInfo,
  getMempoolInfo,
  getNetworkInfo,
  getVersion,
  help,
  stop,
};
