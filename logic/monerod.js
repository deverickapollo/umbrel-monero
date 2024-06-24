import * as monerodService from '../build/services/monerod.js';
import * as MonerodError from '../models/errors.js';

export async function getBlockCount() {
  const blockCount = await monerodService.getBlockCount();

  return {blockCount: blockCount.result};
}

export async function getConnectionsCount() {
  const peerInfo = await monerodService.getPeerInfo();

  let outBoundConnections = 0;
  let inBoundConnections = 0;
  let clearnetConnections = 0;
  let torConnections = 0;
  let i2pConnections = 0;

  peerInfo.result.forEach(function(peer) {
    if (peer.isIncoming === false) {
      outBoundConnections++;
    } else {
      inBoundConnections++;
    }

    // TODO
    // if (peer.type === "onion") {
    //   torConnections++;
    // } else if (peer.type === "i2p") {
    //   i2pConnections++;
    // } else {
    //   // ipv4 and ipv6 are clearnet
    //   clearnetConnections++;
    // }

    clearnetConnections++;
  });

  const connections = {
    total: inBoundConnections + outBoundConnections,
    inbound: inBoundConnections,
    outbound: outBoundConnections,
    clearnet: clearnetConnections,
    tor: torConnections,
    i2p: i2pConnections,
  };

  return connections;
}

export async function getStatus() {
  try {
    const connected = await monerodService.getIsConnected();
    if (connected.result === true) {
      return {operational: true};
    } else {
      return {operational: false};
    }
  } catch (error) {
    if (error instanceof MonerodError.MonerodError) {
      return {operational: false};
    }

    throw error;
  }
}

export async function getMempoolInfo() {
  return await monerodService.getMempoolInfo();
}

// Return the max synced header for all connected peers or -1 if no data is available.
export async function getMaxSyncHeader() {
  const peerInfo = (await monerodService.getPeerInfo()).result;

  if (peerInfo.length === 0) {
    return -1;
  }

  const maxPeer = peerInfo.reduce(function(prev, current) {
    return prev.syncedHeaders > current.syncedHeaders ? prev : current;
  });

  return maxPeer.syncedHeaders;
}

export async function getLocalSyncInfo() {
  const info = await monerodService.getBlockChainInfo();
  const blockChainInfo = info.result;
  const chain = blockChainInfo.chain;
  const blockCount = blockChainInfo.blocks;
  const headerCount = blockChainInfo.headers;
  const percent = blockChainInfo.verificationprogress;
  const pruned = blockChainInfo.pruned;
  return {
    chain,
    percent,
    currentBlock: blockCount,
    headerCount: headerCount, // eslint-disable-line object-shorthand,
    pruned,
  };
}

export async function getSyncStatus() {
  const maxPeerHeader = await getMaxSyncHeader();
  const localSyncInfo = await getLocalSyncInfo();

  if (maxPeerHeader > localSyncInfo.headerCount) {
    localSyncInfo.headerCount = maxPeerHeader;
  }

  return localSyncInfo;
}

// TODO - consider using getNetworkInfo for info on proxy for ipv4 and ipv6
export async function getVersion() {
  const version = await monerodService.getVersion();

  // Remove all non-digits or decimals.
  const formattedVersion = version.replace(/[^\d.]/g, '');

  return {version: formattedVersion}; // eslint-disable-line object-shorthand
}

export async function getTransaction(txid) {
  const transactionObj = await monerodService.getTransaction(txid);

  return {
    txid,
    timestamp: transactionObj.result.time,
    confirmations: transactionObj.result.confirmations,
    blockhash: transactionObj.result.blockhash,
    size: transactionObj.result.size,
    input: transactionObj.result.vin.txid,
    utxo: transactionObj.result.vout,
    rawtx: transactionObj.result.hex,
  };
}

export async function getNetworkInfo() {
  const networkInfo = await monerodService.getNetworkInfo();

  return networkInfo.result; // eslint-disable-line object-shorthand
}

export async function getBlock(hash) {
  const blockObj = await monerodService.getBlock(hash);

  return {
    block: hash,
    confirmations: blockObj.result.confirmations,
    size: blockObj.result.size,
    height: blockObj.result.height,
    blocktime: blockObj.result.time,
    prevblock: blockObj.result.previousblockhash,
    nextblock: blockObj.result.nextblockhash,
    transactions: blockObj.result.tx,
  };
}

const memoizedGetFormattedBlock = () => {
  const cache = {};

  return async (blockHeight) => {
    // cache cleanup
    // 6 blocks/hr * 24 hrs/day * 7 days = 1008 blocks over 7 days
    // plus some wiggle room in case weird difficulty adjustment or period of faster blocks
    // Make CACHE_LIMIT configurable
    const CACHE_LIMIT = process.env.CACHE_LIMIT || 1100;
    while (Object.keys(cache).length > CACHE_LIMIT) {
      const cacheItemToDelete = Object.keys(cache)[0];
      delete cache[cacheItemToDelete];
    }

    if (blockHeight in cache) {
      return cache[blockHeight];
    } else {
      let blockHash;
      try {
        ({result: blockHash} = await monerodService.getBlockHash(blockHeight));
      } catch (error) {
        if (error instanceof MonerodError.MonerodError) {
          return error;
        }
        throw error;
      }

      const {result: block} = await monerodService.getBlock(blockHash);

      cache[blockHeight] = {
        hash: block.hash,
        height: block.height,
        numTransactions: block.numTxs,
        confirmations: block.confirmations,
        time: block.time,
        size: block.size,
        previousblockhash: block.previousblockhash,
      };

      return cache[blockHeight];
    }
  };
};

const initializedMemoizedGetFormattedBlock = memoizedGetFormattedBlock();


export async function getBlockRangeTransactionChunks(fromHeight, toHeight, blocksPerChunk) {
  const {blocks} = await getBlocks(fromHeight, toHeight);

  const chunks = [];
  blocks.forEach((block, index) => {
    const chunkIndex = Math.floor(index / blocksPerChunk);
    if (!chunks[chunkIndex]) {
      chunks[chunkIndex] = {
        time: block.time,
        numTransactions: 0,
      };
    }
    chunks[chunkIndex].numTransactions += block.numTransactions;
  });

  return chunks;
}

export async function getBlocks(fromHeight, toHeight) {
  const blocks = [];

  // loop from 'to height' till 'from Height'
  for (let currentHeight = toHeight - 1; currentHeight >= fromHeight; currentHeight--) {
    // terminate loop if we reach the genesis block
    if (currentHeight === 0) {
      break;
    }

    try {
      const formattedBlock = await initializedMemoizedGetFormattedBlock(currentHeight);
      blocks.push(formattedBlock);
    } catch (e) {
      console.error('Error memoizing formatted blocks');
    }
  }

  return {blocks};
}

export async function getBlockHash(height) {
  const getBlockHashObj = await monerodService.getBlockHash(height);

  return {
    hash: getBlockHashObj.result,
  };
}

// unused function
// async function nodeStatusDump() {
//   const blockchainInfo = await monerodService.getBlockChainInfo();
//   const networkInfo = await monerodService.getNetworkInfo();
//   const mempoolInfo = await monerodService.getMempoolInfo();
//   const miningInfo = await monerodService.getMiningInfo();

//   return {
//     blockchain_info: blockchainInfo.result,
//     network_info: networkInfo.result,
//     mempool: mempoolInfo.result,
//     mining_info: miningInfo.result
//   };
// }



export async function nodeStatusSummary() {
  const blockchainInfo = await monerodService.getBlockChainInfo();

  return {
    difficulty: blockchainInfo.result.difficulty,
    size: blockchainInfo.result.sizeOnDisk,
    mempool: blockchainInfo.result.mempoolBytes,
    mempoolTransactions: blockchainInfo.result.mempoolTransactions,
    connections: blockchainInfo.result.numOutgoingConnections,
    networkhashps: blockchainInfo.result.difficulty / 120, // TODO review bigint conversions
  };
}

export async function stop() {
  const stopResponse = await monerodService.stop();
  return {stopResponse};
}

export async function getIsReady(){
  return await monerodService.isReady();
}