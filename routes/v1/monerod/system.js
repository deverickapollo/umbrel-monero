import express from 'express';
import * as systemLogic from '../../../logic/system.js';
import * as diskLogic from '../../../logic/disk.js';
import * as monerodLogic from '../../../logic/monerod.js';
import * as safeHandler from '../../../utils/safeHandler.js';

const router = express.Router();

router.get('/monero-p2p-connection-details', safeHandler.safeHandler(async (req, res) => {
  const connectionDetails = systemLogic.getMoneroP2PConnectionDetails();

  return res.json(connectionDetails);
}));

router.get('/monero-rpc-connection-details', safeHandler.safeHandler(async (req, res) => {
  const connectionDetails = systemLogic.getMoneroRPCConnectionDetails();

  return res.json(connectionDetails);
}));

router.get('/monero-config', safeHandler.safeHandler(async (req, res) => {
  const moneroConfig = await diskLogic.getJsonStore();
  return res.json(moneroConfig);
}));

// updateJsonStore / generateMoneroConfig are all called through these routes below so that even if user closes the browser prematurely, the backend will complete the update.

router.post('/update-monero-config', safeHandler.safeHandler(async (req, res) => {
  // store old moneroConfig in memory to revert to in case of errors setting new config and restarting monerod
  const oldMoneroConfig = await diskLogic.getJsonStore();
  const newMoneroConfig = req.body.moneroConfig;

  try {
    await diskLogic.applyCustomMoneroConfig(newMoneroConfig, true);
    await monerodLogic.stop();

    res.json({success: true});
  } catch (error) {
    // revert everything to old config values
    await diskLogic.applyCustomMoneroConfig(oldMoneroConfig, true);

    res.json({success: false}); // show error to user in UI
  }
}));

router.post('/restore-default-monero-config', safeHandler.safeHandler(async (req, res) => {
  // store old moneroConfig in memory to revert to in case of errors setting new config and restarting monerod
  const oldMoneroConfig = await diskLogic.getJsonStore();

  try {
    await diskLogic.applyDefaultMoneroConfig();
    await monerodLogic.stop();

    res.json({success: true});
  } catch (error) {
    // revert everything to old config values
    await diskLogic.applyCustomMoneroConfig(oldMoneroConfig, true);

    res.json({success: false}); // show error to user in UI
  }
}));

export default router;