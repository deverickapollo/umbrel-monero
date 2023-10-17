const constants = require('utils/const.js');
const NodeError = require('models/errors.js').NodeError;

function getMoneroP2PConnectionDetails() {
  const torAddress = constants.MONERO_P2P_HIDDEN_SERVICE;
  const port = constants.MONERO_P2P_PORT;
  // const restrictedPort = constants.MONERO_RESTRICTED_RPC_PORT;
  const onionPort = constnats.MONERO_ONION_P2P_PORT;
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

function getMoneroRPCConnectionDetails() {
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

module.exports = {
  getMoneroP2PConnectionDetails,
  getMoneroRPCConnectionDetails,
};
