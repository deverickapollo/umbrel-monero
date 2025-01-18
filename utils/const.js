const isDevelopment = process.env.NODE_ENV === 'development';

export const REQUEST_CORRELATION_NAMESPACE_KEY = 'umbrel-manager-request';
export const REQUEST_CORRELATION_ID_KEY = 'reqId';
export const PORT = process.env.PORT || 8889;
export const DEVICE_HOSTNAME = process.env.DEVICE_HOSTNAME || 'umbrel.local';
export const MONERO_HOST = process.env.MONERO_HOST || 'monerod';
export const MONERO_P2P_HIDDEN_SERVICE = process.env.MONERO_P2P_HIDDEN_SERVICE;
export const MONERO_RPC_HIDDEN_SERVICE = process.env.MONERO_RPC_HIDDEN_SERVICE;
export const MONERO_I2P_HIDDEN_SERVICE = process.env.MONERO_I2P_HIDDEN_SERVICE;
export const MONERO_RPC_USER = process.env.MONERO_RPC_USER;
export const MONERO_RPC_PASSWORD = process.env.MONERO_RPC_PASSWORD;
export const DEVICE_DOMAIN_NAME = process.env.DEVICE_DOMAIN_NAME;
export const JSON_STORE_FILE = process.env.JSON_STORE_FILE
|| (isDevelopment ? './data/monero-config.json' : '/data/monero-config.json');
export const MONERO_CONF_FILEPATH = process.env.MONERO_CONF_FILE
|| (isDevelopment ? './data/monero/bitmonero.conf' : '/monero/.monero/bitmonero.conf');
export const MONERO_LOG_FILE_PATH = isDevelopment
  ? './data/monero/devtest-bitmonero.log'
  : '/data/monero/bitmonero.log';
export const MONERO_SYNC_MODE = process.env.MONERO_SYNC_MODE || 'fast';
export const MONERO_SYNC_TYPE = process.env.MONERO_SYNC_TYPE || 'sync';
export const MONERO_BLOCKS_PER_SYNC = process.env.MONERO_BLOCKS_PER_SYNC || 1000;
export const MONERO_P2P_PORT = process.env.MONERO_P2P_PORT || '18080';
export const MONERO_I2P_P2P_PORT = process.env.MONERO_I2P_P2P_PORT || '18087';
export const MONERO_RPC_PORT = process.env.MONERO_RPC_PORT || '18081';
export const MONERO_ZMQ_PORT = process.env.MONERO_ZMQ_PORT || '18084';
export const MONERO_ZMQ_RPC_PORT = process.env.MONERO_ZMQ_RPC_PORT || '18086';
export const MONERO_RESTRICTED_RPC_PORT = process.env.MONERO_RESTRICTED_RPC_PORT || '18089';
export const MONERO_DEFAULT_NETWORK = process.env.MONERO_DEFAULT_NETWORK || 'mainnet';
export const MONEROD_IP = process.env.MONEROD_IP;
export const TOR_PROXY_IP = process.env.TOR_PROXY_IP;
export const TOR_PROXY_PORT = process.env.TOR_PROXY_PORT;
export const TOR_PROXY_CONTROL_PORT = process.env.TOR_PROXY_CONTROL_PORT;
export const TOR_PROXY_CONTROL_PASSWORD = process.env.TOR_PROXY_CONTROL_PASSWORD;
export const I2P_DAEMON_IP = process.env.I2P_DAEMON_IP;
export const I2P_DAEMON_PORT = process.env.I2P_DAEMON_PORT;
export const CACHE_LIMIT = process.env.CACHE_LIMIT || 5080;
