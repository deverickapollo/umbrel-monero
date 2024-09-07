import * as constants from '../utils/const.js';
// import * as NodeError from '../models/errors.js';

import axios from 'axios';

const state = {
  // Define your state here if needed
};

const getters = {
  // Define your getters here if needed
};

const actions = {
};

const mutations = {
  // Define your mutations here if needed
};

export function getMoneroP2PConnectionDetails() {
  const torAddress = constants.MONERO_P2P_HIDDEN_SERVICE;
  const port = constants.MONERO_P2P_PORT;
  // const restrictedPort = constants.MONERO_RESTRICTED_RPC_PORT;
  const onionPort = constants.MONERO_ONION_P2P_PORT;
  const torConnectionString = `${torAddress}:${port}`;
  const localAddress = constants.DEVICE_DOMAIN_NAME;
  const localConnectionString = `${localAddress}:${port}`;

  return {
    torAddress,
    port,
    onionPort,
    torConnectionString,
    localAddress,
    localConnectionString,
  };
}

export function getMoneroRPCConnectionDetails() {
  const hiddenService = constants.MONERO_RPC_HIDDEN_SERVICE;
  const label = 'My Umbrel';
  const rpcuser = constants.MONERO_RPC_USER;
  const rpcpassword = constants.MONERO_RPC_PASSWORD;
  const torAddress = hiddenService;
  const port = constants.MONERO_RPC_PORT;
  const restrictedPort = constants.MONERO_RESTRICTED_RPC_PORT;
  const torConnectionString = `xmrrpc://${rpcuser}:${rpcpassword}@${torAddress}:${port}?label=${encodeURIComponent(label)}`;
  const localAddress = constants.DEVICE_DOMAIN_NAME;
  const localConnectionString = `xmrrpc://${rpcuser}:${rpcpassword}@${localAddress}:${port}?label=${encodeURIComponent(label)}`;
  const restrictedConnectionString = `xmrrpc://${rpcuser}:${rpcpassword}@${localAddress}:${restrictedPort}?label=${encodeURIComponent(label)}`;

  return {
    rpcuser,
    rpcpassword,
    torAddress,
    port,
    restrictedPort,
    torConnectionString,
    localAddress,
    localConnectionString,
    restrictedConnectionString,
  };
}

export default {
  state,
  getters,
  actions,
  mutations,
};