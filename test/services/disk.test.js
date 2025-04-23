/* globals requester */
import {jest} from '@jest/globals';

// Import all modules that we want to mock
import * as diskService from '../../services/disk.js';
import * as constants from '../../utils/const.js';
import {
  getJsonStore,
  resetPassword,
  updateJsonStore,
  generateMoneroConfig,
  applyMoneroConfig,
  applyCustomMoneroConfig,
  applyDefaultMoneroConfig
} from '../../logic/disk.js';


jest.mock('../../services/disk.js', () => ({
  ...jest.requireActual('../../services/disk.js'), 
  readJsonFile: jest.fn(), 
  writeJsonFile: jest.fn(),
  fileExists: jest.fn(),
  writePlainTextFile: jest.fn(),
}));
jest.mock('../../utils/const.js');

describe('Disk Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getJsonStore', () => {
    it('should return merged settings when JSON store exists', async() => {
      const mockJsonStore = {tor: false};
      diskService.readJsonFile.mockResolvedValue(mockJsonStore);

      const result = await getJsonStore();
      expect(result).toEqual({...DEFAULT_ADVANCED_SETTINGS, ...mockJsonStore});
    });

    it('should return default settings when JSON store does not exist', async() => {
      diskService.readJsonFile.mockRejectedValue(new Error('File not found'));

      const result = await getJsonStore();
      expect(result).toEqual(DEFAULT_ADVANCED_SETTINGS);
    });
  });

  describe('resetPassword', () => {
    it('should update JSON store with resetPassword set to true', async() => {
      const mockJsonStore = {resetPassword: true};
      diskService.readJsonFile.mockResolvedValue(mockJsonStore);
      diskService.writeJsonFile.mockResolvedValue();

      await resetPassword();

      expect(diskService.writeJsonFile).toHaveBeenCalledWith(constants.JSON_STORE_FILE, {
        ...mockJsonStore,
        resetPassword: true,
      });
    });
  });

  describe('updateJsonStore', () => {
    it('should update JSON store with new properties', async() => {
      const mockJsonStore = {tor: false};
      const newProps = {tor: true};
      diskService.readJsonFile.mockResolvedValue(mockJsonStore);
      diskService.writeJsonFile.mockResolvedValue();

      await updateJsonStore(newProps);

      expect(diskService.writeJsonFile).toHaveBeenCalledWith(constants.JSON_STORE_FILE, {
        ...mockJsonStore,
        ...newProps,
      });
    });
  });

  describe('generateMoneroConfig', () => {
    it('should create a new config file if it does not exist', async() => {
      diskService.fileExists.mockResolvedValue(false);
      diskService.writePlainTextFile.mockResolvedValue();

      await generateMoneroConfig(true, DEFAULT_ADVANCED_SETTINGS);

      expect(diskService.writePlainTextFile).toHaveBeenCalledWith(constants.MONERO_CONF_FILEPATH, expect.any(String));
    });

    it('should overwrite existing config file if shouldOverwriteExistingFile is true', async() => {
      diskService.fileExists.mockResolvedValue(true);
      diskService.writePlainTextFile.mockResolvedValue();

      await generateMoneroConfig(true, DEFAULT_ADVANCED_SETTINGS);

      expect(diskService.writePlainTextFile).toHaveBeenCalledWith(constants.MONERO_CONF_FILEPATH, expect.any(String));
    });

    it('should not overwrite existing config file if shouldOverwriteExistingFile is false', async() => {
      diskService.fileExists.mockResolvedValue(true);

      await generateMoneroConfig(false, DEFAULT_ADVANCED_SETTINGS);

      expect(diskService.writePlainTextFile).not.toHaveBeenCalled();
    });
  });

  describe('applyMoneroConfig', () => {
    it('should update JSON store and generate Monero config', async() => {
      const mockConfig = {tor: false};
      diskService.writeJsonFile.mockResolvedValue();
      diskService.writePlainTextFile.mockResolvedValue();

      await applyMoneroConfig(mockConfig, true);

      expect(diskService.writeJsonFile).toHaveBeenCalledWith(constants.JSON_STORE_FILE, expect.any(Object));
      expect(diskService.writePlainTextFile).toHaveBeenCalledWith(constants.MONERO_CONF_FILEPATH, expect.any(String));
    });
  });

  describe('applyCustomMoneroConfig', () => {
    it('should apply custom Monero config', async() => {
      const mockConfig = {tor: false};
      diskService.writeJsonFile.mockResolvedValue();
      diskService.writePlainTextFile.mockResolvedValue();

      await applyCustomMoneroConfig(mockConfig, true);

      expect(diskService.writeJsonFile).toHaveBeenCalledWith(constants.JSON_STORE_FILE, expect.any(Object));
      expect(diskService.writePlainTextFile).toHaveBeenCalledWith(constants.MONERO_CONF_FILEPATH, expect.any(String));
    });
  });

  describe('applyDefaultMoneroConfig', () => {
    it('should apply default Monero config', async() => {
      diskService.writeJsonFile.mockResolvedValue();
      diskService.writePlainTextFile.mockResolvedValue();

      await applyDefaultMoneroConfig();

      expect(diskService.writeJsonFile).toHaveBeenCalledWith(constants.JSON_STORE_FILE, expect.any(Object));
      expect(diskService.writePlainTextFile).toHaveBeenCalledWith(constants.MONERO_CONF_FILEPATH, expect.any(String));
    });
  });
});
