const express = require('express');
const router = express.Router();
const monerod = require('logic/monerod.js');
const safeHandler = require('utils/safeHandler');
// const networkLogic = require('logic/network.js');

// // unused by UI
// router.get('/mempool', safeHandler((req, res) =>
//   monerod.getMempoolInfo()
//     .then(mempool => res.json(mempool.result))
// ));

// // unused by UI
// router.get('/addresses', safeHandler((req, res) =>
//   networkLogic.getMonerodAddresses()
//     .then(addresses => res.json(addresses))
// ));

// // unused by UI
// router.get('/blockcount', safeHandler((req, res) =>
//   monerod.getBlockCount()
//     .then(blockCount => res.json(blockCount))
// ));

router.get('/connections', safeHandler((req, res) =>
  monerod.getConnectionsCount()
    .then(connections => res.json(connections))
));

router.get('/status', safeHandler((req, res) =>
  monerod.getStatus()
    .then(status => res.json(status))
));

router.get('/sync', safeHandler((req, res) =>
  monerod.getSyncStatus()
    .then(status => res.json(status))
));

router.get('/version', safeHandler((req, res) =>
  monerod.getVersion()
    .then(version => res.json(version))
));

// unused by UI
// router.get('/statsDump', safeHandler((req, res) =>
//   monerod.nodeStatusDump()
//     .then(statusdump => res.json(statusdump))
// ));

router.get('/stats', safeHandler((req, res) =>
  monerod.nodeStatusSummary()
    .then(statussumarry => res.json(statussumarry))
));

router.get('/block', safeHandler((req, res) => {
  if (req.query.hash !== undefined && req.query.hash !== null) {
    monerod.getBlock(req.query.hash)
      .then(blockhash => res.json(blockhash))
  } else if (req.query.height !== undefined && req.query.height !== null) {
    monerod.getBlockHash(req.query.height)
      .then(blockhash => res.json(blockhash))
  }
}
));

// /v1/monerod/info/block/<hash>
router.get('/block/:id', safeHandler((req, res) =>
  monerod.getBlock(req.params.id)
    .then(blockhash => res.json(blockhash))
));

router.get('/blocks', safeHandler((req, res) => {
  const fromHeight = parseInt(req.query.from);
  const toHeight = parseInt(req.query.to);

  if (toHeight - fromHeight > 500) {
    res.status(500).json('Range query must be less than 500');
    return;
  }

  monerod.getBlocks(fromHeight, toHeight)
    .then(blocks => res.json(blocks))
}
));

// unused by UI
// router.get('/txid/:id', safeHandler((req, res) =>
//   monerod.getTransaction(req.params.id)
//     .then(txhash => res.json(txhash))
// ));

module.exports = router;
