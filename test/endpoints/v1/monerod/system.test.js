/* globals requester */
import {jest} from '@jest/globals';


// 1. Mock the entire system.js module:
jest.mock('../../../../logic/system.js', () => {
  // Use requireActual to import the real module
  const actual = jest.requireActual('../../../../logic/system.js');

  return {
    __esModule: true,
    ...actual,

    // 2. Override just the function you need
    getMoneroP2PConnectionDetails: jest.fn(() => ({
      torAddress: '127.0.0.1',
      port: '18080',

      // Add any other properties you need
    })),
  };
});

describe('system', () => {

  beforeEach(() => {
    jest.clearAllMocks();

  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should respond on /check-image GET with the isInstalled property', async() => {
    const res = await requester.get('/v1/monerod/system/check-image');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('isInstalled');
  });

  it('should respond on /monero-p2p-connection-details GET with connection details', async() => {
    const res = await requester.get('/v1/monerod/system/monero-p2p-connection-details');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('localConnectionString', 'undefined:18080');
    expect(res.body).toHaveProperty('port', '18080');
    expect(res.body).toHaveProperty('torConnectionString', 'undefined:18080');
  });

  it('should respond on /monero-rpc-connection-details GET with connection details', async() => {
    const res = await requester.get('/v1/monerod/system/monero-rpc-connection-details');
    expect(res.status).toBe(200);

    // expect(res.body).toHaveProperty('rpcuser');
    // expect(res.body).toHaveProperty('rpcpassword');
    expect(res.body).toHaveProperty('port');
    expect(res.body).toHaveProperty('restrictedPort');

    // expect(res.body).toHaveProperty('torAddress');
    expect(res.body).toHaveProperty('torConnectionString');

    // expect(res.body).toHaveProperty('localAddress');
    expect(res.body).toHaveProperty('localConnectionString');
    expect(res.body).toHaveProperty('restrictedConnectionString');
  });

  it('should respond on /monero-config GET with the monero config', async() => {
    const res = await requester.get('/v1/monerod/system/monero-config');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('blockNotify');
    expect(res.body).toHaveProperty('btcpayserver');
    expect(res.body).toHaveProperty('checkpoint');
    expect(res.body).toHaveProperty('dbBlocksPerSync');
    expect(res.body).toHaveProperty('dbSalvage');
    expect(res.body).toHaveProperty('dbSyncMode');
    expect(res.body).toHaveProperty('dbSyncType');
    expect(res.body).toHaveProperty('hidePort');
    expect(res.body).toHaveProperty('i2p');
    expect(res.body).toHaveProperty('incomingConnections');
    expect(res.body).toHaveProperty('minercpuTarget');
    expect(res.body).toHaveProperty('mining');
    expect(res.body).toHaveProperty('moneroAddress');
    expect(res.body).toHaveProperty('network');
    expect(res.body).toHaveProperty('p2pool');
    expect(res.body).toHaveProperty('prune');
    expect(res.body).toHaveProperty('publicNode');
    expect(res.body).toHaveProperty('resetPassword');
    expect(res.body).toHaveProperty('tor');
    expect(res.body).toHaveProperty('upnp');
    expect(res.body).toHaveProperty('zmq');
  });

  // Uncomment and update the following tests as needed

  // it('should respond on /update-monero-config POST with success property', async () => {
  //   const res = await requester.post('/v1/monerod/system/update-monero-config').send({moneroConfig: {}});
  //   expect(res.status).toBe(200);
  //   expect(res.body).toHaveProperty('success');
  // });

  // it('should respond on /restore-default-monero-config POST with success property', async () => {
  //   const res = await requester.post('/v1/monerod/system/restore-default-monero-config');
  //   expect(res.status).toBe(200);
  //   expect(res.body).toHaveProperty('success');
  // });

  // it('should respond on /reset-rpc-password POST with success property', async () => {
  //   const res = await requester.post('/v1/monerod/system/reset-rpc-password');
  //   expect(res.status).toBe(200);
  //   expect(res.body).toHaveProperty('success');
  // });
});
