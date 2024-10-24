import RpcClient from "monero-ts";
import { MonerodError } from '../models/errors.js';
import { MoneroDaemonRpc, MoneroBlock, MoneroTx, MoneroDaemonInfo, MoneroTxPoolStats, MoneroPeer, ConnectionType } from 'monero-ts';

const MONEROD_RPC_PORT = process.env.MONERO_RPC_PORT || 18081; // eslint-disable-line no-magic-numbers, max-len
const MONEROD_HOST = process.env.MONERO_HOST || '127.0.0.1';
const MONEROD_RPC_USER = process.env.MONERO_RPC_USER || 'monero';
const MONEROD_RPC_PASSWORD = process.env.MONERO_RPC_PASSWORD || 'monero';

const MONEROD_IP = `http://${MONEROD_HOST}:${MONEROD_RPC_PORT}`;

interface BlockInterface {
  hash: string;
  height: number;
  numTxs: number;
  confirmations: number;
  time: number;
  size: number;
  previousblockhash: string;
}

interface infoInterface {
  chain: string;
  blocks: number;
  headers: number;
  difficulty: number;
  sizeOnDisk: number;
  numOutgoingConnections: number;
  mempoolBytes: number;
  mempoolTransactions: number;
  verificationprogress: number;
  pruned: boolean;
}

interface State {
  addrLocal: string;
  type: ConnectionType;
  syncedHeaders: number;
  isIncoming: boolean;
}


/**
 * RPC/Monero Daemon Resources
 * https://www.getmonero.org/resources/developer-guides/daemon-rpc.html
 * https://moneroecosystem.org/monero-javascript/MoneroDaemon.html
 */

class MoneroDaemon {
  private static instance: MoneroDaemon;
  daemon: MoneroDaemonRpc | undefined;
  ready: Promise<void> | false = false;
  
  constructor() {
    // this.ready = (async () => {
    //   try {
    //     await this.init();
    //   } catch (err) {
    //     throw new MonerodError('Unable to initialize Monero daemon.', err);
    //   }
    // })();
  }

  async initialize() {
    if (!this.ready) {
      this.ready = (async () => {
        try {
          await this.init();
        } catch (err) {
          throw new MonerodError('Unable to initialize Monero daemon.', err);
        }
      })();
    }
    return this.ready;
  }

  async init() {
    try {
      this.daemon = await RpcClient.connectToDaemonRpc({
        uri: MONEROD_IP,
        username: MONEROD_RPC_USER,
        password: MONEROD_RPC_PASSWORD,
      });
    } catch (err) {
      throw new MonerodError('Unable to connect to Monero daemon.', err);
    }
  }

  public returnReady() {
    return this.ready;
  } 

  async stop() {
    if(!this.daemon) {
      throw new MonerodError('Daemon is not connecte during stop');
    }
    await this.daemon.stop();
  }
  
}


const daemonController = new MoneroDaemon();
await daemonController.initialize();

export async function getBlockHash(height: number): Promise<{result: string}> {
  try {
    const blockhash: string = await daemonController.daemon!.getBlockHash(height);
    return {result: blockhash};
  } catch (err) {
    throw new MonerodError('Unable to obtain getBlockHash from Daemon', err);
  }
}

export async function getBlock(hash: string): Promise<{result: BlockInterface}> {
  try {
    const state: MoneroBlock = await daemonController.daemon!.getBlockByHash(hash);

    const block: BlockInterface = {
      hash: state.hash,
      height: state.height,
      numTxs: state.numTxs,
      confirmations: 100, // TODO implement,
      time: state.timestamp,
      size: state.size,
      previousblockhash: state.prevHash,
    };
    return {result: block};
  } catch (err) {
    throw new MonerodError('Unable to obtain getBlock from Daemon', err);
  }
}

export async function getTransaction(txHash: string): Promise<{result: MoneroTx}> {
  try {
    const hash: MoneroTx = await daemonController.daemon!.getTx(txHash);
    return {result: hash};
  } catch (err) {
    throw new MonerodError('Unable to obtain getTransaction from Daemon', err);
  }
}

export function getSyncPercentage(height: number, targetHeight: number): number{
  if (targetHeight > height && targetHeight !== 0) {
    // eslint-disable-next-line no-magic-numbers
    return Number((height / targetHeight).toFixed(4));
  }
  return 1;
}

export async function getIsConnected() {
  try {
    if(!daemonController.daemon) {
      throw new MonerodError('Daemon is not connected during check connection');
    }
    const connected = await daemonController.daemon!.isConnected();
    return {result: connected};
  } catch (err) {
    throw new MonerodError('Unable to obtain isConnecteds from Daemon', err);
  }
}

export async function getBlockChainInfo(): Promise<{result: infoInterface}>{
  try {
    const infoState: MoneroDaemonInfo = await daemonController.daemon!.getInfo();
    
    const miningInfo: MoneroTxPoolStats = await daemonController.daemon!.getTxPoolStats();

    const infoResult: infoInterface = {
      chain: RpcClient.MoneroNetworkType.toString(infoState.networkType),
      blocks: infoState.height,
      headers: infoState.height,
      difficulty: Number(infoState.difficulty),
      sizeOnDisk: infoState.databaseSize,
      numOutgoingConnections: infoState.numOutgoingConnections,
      mempoolBytes: miningInfo.getBytesTotal(),
      mempoolTransactions: miningInfo.getNumTxs(),
      verificationprogress: getSyncPercentage(
          infoState.height,
          infoState.targetHeight,
      ),
      pruned: true, // TODO implement after monero-js implements
    };

    return {result: infoResult};

  } catch (err) {
    throw new MonerodError(
        'Unable to obtain getBlockChainInfo from Daemon',
        err,
    );
  }
}

export async function getPeerInfo() {
  try {
    const peers: MoneroPeer[] = await daemonController.daemon!.getPeers();

    let mappedPeers: State[] = [];
    if (peers && peers.length > 0) {
      mappedPeers = peers.map((state) => ({
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

export async function getBlockCount(): Promise<number>{
  try {
    const state: MoneroDaemonInfo = await daemonController.daemon!.getInfo();

    return state.height;
  } catch (err) {
    throw new MonerodError('Unable to obtain getBlockCount from Daemon', err);
  }
}

// TODO implement this
export async function getMempoolInfo(): Promise<{result: MoneroTx[]}>{
  try {

    const pool: MoneroTx[] = await daemonController.daemon!.getTxPool();

    return {result: pool};
  } catch (err) {
    throw new MonerodError('Unable to obtain getMempoolInfo from Daemon', err);
  }
}

export async function getVersion() {
  try {
    const info: MoneroDaemonInfo  = await daemonController.daemon!.getInfo();

    return info.version;
  } catch (err) {
    throw new MonerodError('Unable to obtain getVersion from Daemon', err);
  }
}

// TODO implement
export async function getNetworkInfo() {
  try {
    const peers: MoneroPeer[]  = await daemonController.daemon!.getPeers();

    interface HardForkInfoData {
      connections: number | undefined;
      localAddresses: any | undefined;
      hardForkInfo: any | undefined;
      blockHeader: any | undefined;
      blockHeight: number | undefined;
      version: string | undefined;
      height: number | undefined;
      difficulty: number | undefined;
      hashrate: number | undefined;
      tx_count: number | undefined;
      fee_per_kb: number | undefined;
      fee_address: string | undefined;
      fee_amount: number | undefined;
    }

    const hardForkInfoData: HardForkInfoData = {
      connections: peers ? peers.length : 0,
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
      fee_amount: undefined,
    };

    return {
      result: {
        hardForkInfoData,
      },
    };
  } catch (err) {
    throw new MonerodError('Unable to obtain getNetworkInfo from Daemon', err);
  }
}

export async function stop() {
  await daemonController.daemon!.stop();
}

export async function isReady() {
  await daemonController.returnReady();
}