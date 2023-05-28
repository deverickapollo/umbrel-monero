const express = require('express');
const router = express.Router();
const monerod = require('logic/monerod.js');
const monerodService = require('services/monerod.js');
const safeHandler = require('utils/safeHandler');

const aggregates = {
  '1hr': [],
  '6hr': [],
  '12hr': [],
  '1d': [],
  '3d': [],
  '7d': [],
};

const setAggregatesValues = async() => {
  const {result: blockchainInfo} = await monerodService.getBlockChainInfo();
  const syncPercent = blockchainInfo.verificationprogress;
  
  // only start caching once sync is getting close to complete
  if (syncPercent > 0.98) { 
    const currentBlock = blockchainInfo.blocks;
    
    const ONE_HOUR_AS_BLOCKS = 30;
    const SIX_HOURS_AS_BLOCKS = 180;
    const TWELVE_HOURS_AS_BLOCKS = 360;
    const ONE_DAY_AS_BLOCKS = 720;
    const THREE_DAY_AS_BLOCKS = 2160;
    const SEVEN_DAY_AS_BLOCKS = 5040;

    const ranges = await Promise.all([
      monerod.getBlockRangeTransactionChunks(currentBlock - ONE_HOUR_AS_BLOCKS, currentBlock, 1), // 1hr
      monerod.getBlockRangeTransactionChunks(currentBlock - SIX_HOURS_AS_BLOCKS, currentBlock, 6), // 6hr
      monerod.getBlockRangeTransactionChunks(currentBlock - TWELVE_HOURS_AS_BLOCKS, currentBlock, 36), // 12hr
      monerod.getBlockRangeTransactionChunks(currentBlock - ONE_DAY_AS_BLOCKS, currentBlock, 72), // 1d
      monerod.getBlockRangeTransactionChunks(currentBlock - THREE_DAY_AS_BLOCKS, currentBlock, 144), // 3d
      monerod.getBlockRangeTransactionChunks(currentBlock - SEVEN_DAY_AS_BLOCKS, currentBlock, 432) // 7d
    ]);

    aggregates['1hr'] = ranges[0];
    aggregates['6hr'] = ranges[1];
    aggregates['12hr'] = ranges[2];
    aggregates['1d'] = ranges[3];
    aggregates['3d'] = ranges[4];
    aggregates['7d'] = ranges[5];
    
    
    return aggregates;
  }
};

router.get('/charts', safeHandler((req, res) => {
  res.json(aggregates);
}
));

module.exports = router;
