import API from '@/helpers/api';
import {toPrecision} from '@/helpers/units';

// const BYTES_PER_GB = 1000000000;
// Initial state
const state = () => ({
  operational: false,

  // calibrating: false,
  version: '',
  p2p: {
    port: '',
    localAddress: '',
    localConnectionString: '',
    torAddress: '',
    torConnectionString: ''
  },
  rpc: {
    rpcuser: '',
    rpcpassword: '',
    port: '',
    restrictedPort: '',
    localAddress: '',
    localConnectionString: '',
    torAddress: '',
    torConnectionString: '',
    restrictedConnectionString: ''
  },
  currentBlock: 0,
  chain: '',
  pruned: false,
  blockHeight: 0,
  blocks: [],
  percent: -1, // for loading state
  depositAddress: '',
  stats: {
    peers: -1,
    mempool: -1,
    mempoolTransactions: -1,
    hashrate: -1,
    blockchainSize: -1
  },
  peers: {
    total: 0,
    inbound: 0,
    outbound: 0,
    clearnet: 0,
    tor: 0,
    i2p: 0
  },
  mining: {
    hashrate: -1,
    address: '',
    threadCount: -1,
    isMining: false,
    background: false
  },
  chartData: []
});

// Functions to update the state directly
const mutations = {
  isOperational(state, operational) {
    state.operational = operational;
  },

  syncStatus(state, sync) {
    state.percent = Number(toPrecision(parseFloat(sync.percent) * 100, 2));
    state.currentBlock = sync.currentBlock;
    state.blockHeight = sync.headerCount;
    state.chain = sync.chain;
    state.pruned = sync.pruned;
  },

  setBlocks(state, blocks) {
    const mergedBlocks = [...blocks, ...state.blocks];

    // remove duplicate blocks
    const uniqueBlocks = mergedBlocks.filter(
      (v, i, a) => a.findIndex(t => t.height === v.height) === i
    );

    // limit to latest 6 blocks
    state.blocks = [...uniqueBlocks.slice(0, 6)];
  },

  setVersion(state, version) {
    state.version = version.version;
  },

  setStats(state, stats) {
    state.stats.peers = stats.peers;
    state.stats.mempool = stats.mempool;
    state.stats.mempoolTransactions = stats.mempoolTransactions;
    state.stats.blockchainSize = stats.blockchainSize;
    state.stats.hashrate = stats.hashrate;
  },

  setP2PInfo(state, p2pInfo) {
    state.p2p.port = p2pInfo.port;
    state.p2p.localAddress = p2pInfo.localAddress;
    state.p2p.localConnectionString = p2pInfo.localConnectionString;
    state.p2p.torAddress = p2pInfo.torAddress;
    state.p2p.torConnectionString = p2pInfo.torConnectionString;
  },

  setRpcInfo(state, rpcInfo) {
    state.rpc.rpcuser = rpcInfo.rpcuser;
    state.rpc.rpcpassword = rpcInfo.rpcpassword;
    state.rpc.port = rpcInfo.port;
    state.rpc.restrictedPort = rpcInfo.restrictedPort;
    state.rpc.localAddress = rpcInfo.localAddress;
    state.rpc.localConnectionString = rpcInfo.localConnectionString;
    state.rpc.restrictedConnectionString = rpcInfo.restrictedConnectionString;
    state.rpc.torAddress = rpcInfo.torAddress;
    state.rpc.torConnectionString = rpcInfo.torConnectionString;
  },

  peers(state, peers) {
    state.peers.total = peers.total || 0;
    state.peers.inbound = peers.inbound || 0;
    state.peers.outbound = peers.outbound || 0;
    state.peers.clearnet = peers.clearnet || 0;
    state.peers.tor = peers.tor || 0;
    state.peers.i2p = peers.i2p || 0;
  },

  setChartData(state, chartData) {
    state.chartData = chartData;
  },

  setMining(state, mining) {
    state.mining.hashrate = mining.hashrate;
    state.mining.address = mining.address;
    state.mining.threadCount = mining.threadCount;
    state.mining.isMining = mining.isMining;
    state.mining.background = mining.background;
  }
};

// Functions to get data from the API
const actions = {
  async getStatus({commit, dispatch}) {
    const status = await API.get(
      `${import.meta.env.VITE_API_BASE_URL}/v1/monerod/info/status`
    );

    if (status.operational) {
      // Add check for peers to ensure we have a targetheight before calling getSync dispatch
      const peers = await API.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/monerod/info/connections`
      );
      if (peers.total > 1) {
        commit('isOperational', status.operational);
        await dispatch('getSync');
      } else {
        commit('isOperational', false);
      }
    } else {
      commit('isOperational', status.operational);
    }
  },

  async getP2PInfo({commit}) {
    const p2pInfo = await API.get(
      `${import.meta.env.VITE_API_BASE_URL}/v1/monerod/system/monero-p2p-connection-details`
    );

    if (p2pInfo) {
      commit('setP2PInfo', p2pInfo);
    }
  },

  async getRpcInfo({commit}) {
    const rpcInfo = await API.get(
      `${import.meta.env.VITE_API_BASE_URL}/v1/monerod/system/monero-rpc-connection-details`
    );

    if (rpcInfo) {
      commit('setRpcInfo', rpcInfo);
    }
  },

  async getSync({commit}) {
    const sync = await API.get(
      `${import.meta.env.VITE_API_BASE_URL}/v1/monerod/info/sync`
    );

    if (sync) {
      commit('syncStatus', sync);
    }
  },

  async getMining({commit}) {
    const mining = await API.get(
      `${import.meta.env.VITE_API_BASE_URL}/v1/monerod/info/mining`
    );

    if (mining) {
      commit('setMining', mining);
    }
  },

  async getBlocks({commit, state, dispatch}) {
    await dispatch('getSync');

    // Cache block height array of latest 3 blocks for loading view
    const currentBlock = state.currentBlock;

    // Don't fetch blocks if no new block has been found
    if (state.blocks.length && currentBlock === state.blocks[0].height) {
      return;
    }

    // Don't fetch blocks if < 3 blocks primarily because we don't have a UI
    // ready for a blockchain with < 3 blocks
    if (currentBlock < 3) {
      return;
    }

    // TODO: Fetch only new blocks
    const latestFiveBlocks = await API.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/v1/monerod/info/blocks?from=${currentBlock - 3}&to=${currentBlock}`
    );

    if (!latestFiveBlocks.blocks) {
      return;
    }

    // Update blocks
    commit('setBlocks', latestFiveBlocks.blocks);
  },


  async getChartData({dispatch, state, commit}) {
    // get the latest block height
    await dispatch('getSync');

    const currentBlock = state.currentBlock;

    // check if atleast 180 blocks exist
    if (!currentBlock || currentBlock < 180) {
      return;
    }

    // get last 180 blocks (~24 hours)
    const lastDaysBlocks = await API.get(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/v1/monerod/info/blocks?from=${currentBlock - 179}&to=${currentBlock}`
    );

    // exit if we don't get the blocks for some reason
    if (
      !lastDaysBlocks
      || !lastDaysBlocks.blocks
      || !lastDaysBlocks.blocks.length
    ) {
      return;
    }

    // add up transactions in 6 blocks and use last block's timestamp
    // to create an array like this
    // [[timestamp, transactions], ...]

    const chartData = [];

    const CHUNK_SIZE = 12;
    let transactionsInCurrentChunk = 0;
    let currentChunkSize = 0;

    for (const block of lastDaysBlocks.blocks) {
      transactionsInCurrentChunk += Number(block.numTransactions);
      currentChunkSize++;
      if (currentChunkSize === CHUNK_SIZE) {
        chartData.push([Number(block.time), transactionsInCurrentChunk]);
        currentChunkSize = 0;
        transactionsInCurrentChunk = 0;
      }
    }

    // sort by ascending timestamps and update state
    chartData.sort((a, b) => a[0] - b[0]);

    commit('setChartData', chartData);
  },

  async getVersion({commit}) {
    const version = await API.get(
      `${import.meta.env.VITE_API_BASE_URL}/v1/monerod/info/version`
    );

    if (version) {
      commit('setVersion', version);
    }
  },

  async getPeers({commit}) {
    const peers = await API.get(
      `${import.meta.env.VITE_API_BASE_URL}/v1/monerod/info/connections`
    );

    if (peers) {
      commit('peers', peers);
    }
  },

  async getStats({commit}) {
    const stats = await API.get(
      `${import.meta.env.VITE_API_BASE_URL}/v1/monerod/info/stats`
    );

    if (stats) {
      const peers = stats.connections;
      const mempool = stats.mempool;
      const mempoolTransactions = stats.mempoolTransactions;
      const hashrate = stats.networkhashps;
      const blockchainSize = stats.size;

      commit('setStats', {
        peers,
        mempool,
        mempoolTransactions,
        hashrate,
        blockchainSize
      });
    }
  }
};

const getters = {
  status(state) {
    const data = {
      class: 'loading',
      text: 'Loading...'
    };

    if (state.operational) {
      data.class = 'active';
      data.text = 'Operational';
    }

    return data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
