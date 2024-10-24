import express from 'express';
import * as monerod from '../../../logic/monerod.js';
import * as safeHandler from '../../../utils/safeHandler.js';

const router = express.Router();

router.get('/connections', safeHandler.safeHandler((req, res) =>
  monerod.getConnectionsCount()
    .then(connections => res.json(connections)),
));

router.get('/status', safeHandler.safeHandler((req, res) =>
  monerod.getStatus()
    .then(status => res.json(status)),
));

router.get('/sync', safeHandler.safeHandler((req, res) =>
  monerod.getSyncStatus()
    .then(status => res.json(status)),
));

router.get('/version', safeHandler.safeHandler((req, res) =>
  monerod.getVersion()
    .then(version => res.json(version)),
));

router.get('/stats', safeHandler.safeHandler((req, res) =>
  monerod.nodeStatusSummary()
    .then(statussumarry => res.json(statussumarry)),
));

router.get('/block', safeHandler.safeHandler((req, res) => {
  if (req.query.hash !== undefined && req.query.hash !== null) {
    monerod.getBlock(req.query.hash)
      .then(blockhash => res.json(blockhash));
  } else if (req.query.height !== undefined && req.query.height !== null) {
    monerod.getBlockHash(req.query.height)
      .then(blockhash => res.json(blockhash));
  }
},
));

// /v1/monerod/info/block/<hash>
router.get('/block/:id', safeHandler.safeHandler((req, res) =>
  monerod.getBlock(req.params.id)
    .then(blockhash => res.json(blockhash)),
));

router.get('/blocks', safeHandler.safeHandler((req, res) => {
  const fromHeight = parseInt(req.query.from);
  const toHeight = parseInt(req.query.to);

  if (toHeight - fromHeight > 500) {
    res.status(500).json('Range query must be less than 500');

    return;
  }

  monerod.getBlocks(fromHeight, toHeight)
    .then(blocks => res.json(blocks));
},
));

export default router;
