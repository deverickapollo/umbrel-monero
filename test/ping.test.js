/* globals requester */
import {jest} from '@jest/globals';

describe('system', () => {
  beforeEach(() => {
    jest.clearAllMocks();

  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should respond on /ping GET with the isInstalled property', async() => {
    const res = await requester.get('/ping');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('version');
    expect(res.type).toBe('application/json');
    expect(res.body.version).toBe('umbrel-middleware-0.4.0');
  });
});

// Rewrite the above test using jest
