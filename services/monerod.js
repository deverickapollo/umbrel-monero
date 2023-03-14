const RpcClient = require("monero-javascript");
const camelizeKeys = require('camelize-keys');
const MonerodError = require('models/errors.js').MonerodError;

const MONEROD_RPC_PORT = process.env.RPC_PORT || 18081; // eslint-disable-line no-magic-numbers, max-len
const MONEROD_HOST = process.env.MONERO_HOST || '127.0.0.1';
const MONEROD_RPC_USER = process.env.RPC_USER;
const MONEROD_RPC_PASSWORD = process.env.RPC_PASSWORD;

const MONEROD_IP = `http://${MONEROD_HOST}:${MONEROD_RPC_PORT}`;

//await is only valid in async functions and the top level bodies of modules
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await

const rpcClient = new RpcClient.connectToDaemonRpc({
  uri: MONEROD_IP,
  username: MONEROD_RPC_USER,
  password: MONEROD_RPC_PASSWORD
});



function promiseify(rpcObj, rpcFn, what) {
  return new Promise((resolve, reject) => {
    try {
      rpcFn.call(rpcObj, (err, info) => {
        if (err) {
          reject(new MonerodError(`Unable to obtain ${what}`, err));
        } else {
          resolve(camelizeKeys(info, '_'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function promiseifyParam(rpcObj, rpcFn, param, what) {
  return new Promise((resolve, reject) => {
    try {
      rpcFn.call(rpcObj, param, (err, info) => {
        if (err) {
          reject(new MonerodError(`Unable to obtain ${what}`, err));
        } else {
          resolve(camelizeKeys(info, '_'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function promiseifyParamTwo(rpcObj, rpcFn, param1, param2, what) {
  return new Promise((resolve, reject) => {
    try {
      rpcFn.call(rpcObj, param1, param2, (err, info) => {
        if (err) {
          reject(new MonerodError(`Unable to obtain ${what}`, err));
        } else {
          resolve(camelizeKeys(info, '_'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getBestBlockHash() {
  return promiseify(rpcClient, rpcClient.getLastBlockHeader, 'best block hash');
}

function getBlockHash(height) {
  return promiseifyParam(rpcClient, rpcClient.getBlockHash, height, 'block height');
}

function getBlock(hash) {
  return promiseifyParam(rpcClient, rpcClient.getBlockByHash, hash, 'block info');
}

function getTransaction(txHash) {
  return promiseifyParamTwo(rpcClient, rpcClient.getTx, txHash, 1, 'transaction info');
}

function getBlockChainInfo() {
  return promiseify(rpcClient, rpcClient.get_info, 'blockchain info');
}

function getPeerInfo() {
  return promiseify(rpcClient, rpcClient.getPeers, 'peer info');
}

function getBlockCount() {
  return promiseify(rpcClient, rpcClient.getHeight, 'block count');
}

function getMempoolInfo() {
  return promiseify(rpcClient, rpcClient.get_txpool, 'get mempool info');
}

function getNetworkInfo() {
  const hardForkInfo = daemon.getHardForkInfo();
  const blockHeader = daemon.getLastBlockHeader();
  const blockHeight = blockHeader.height;
  const version = hardForkInfo.version
  const height = blockHeight
  const difficulty = hardForkInfo.difficulty
  const hashrate = hardForkInfo.difficulty / blockHeader.timestamp
  const tx_count = hardForkInfo.tx_count
  const fee_per_kb = hardForkInfo.fee_address
  const fee_address = hardForkInfo.fee_address
  const fee_amount = hardForkInfo.fee_amount

  return promiseify(rpcClient, rpcClient.getNetworkInfo, 'network info');
}

function getMiningInfo() {
  const blockHeader = daemon.getLastBlockHeader();
  const blockHeight = blockHeader.height;
  const difficulty = blockHeader.difficulty;
  const hashrate = difficulty / blockHeader.timestamp;
  const tx_count = blockHeader.tx_count;
  const fee_per_kb = blockHeader.fee_per_kb;
  const fee_address = blockHeader.fee_address;
  const fee_amount = blockHeader.fee_amount;

  return promiseify(rpcClient, rpcClient.getMiningInfo, 'mining info');
}
function help() {
  // TODO: missing from the library, but can add it not sure how to package.
  // rpc.uptime(function (err, res) {
  //     if (err) {
  //         deferred.reject({status: 'offline'});
  //     } else {
  //         deferred.resolve({status: 'online'});
  //     }
  // });
  return promiseify(rpcClient, rpcClient.help, 'help data');
}

function stop() {
  return promiseify(rpcClient, rpcClient.stop, 'stop');
}

module.exports = {
  getMiningInfo,
  getBestBlockHash,
  getBlockHash,
  getBlock,
  getTransaction,
  getBlockChainInfo,
  getBlockCount,
  getPeerInfo,
  getMempoolInfo,
  getNetworkInfo,
  help,
  stop,
};
