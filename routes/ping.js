import express from 'express';

// import * as pjson from '../package.json';
import pjson from '../package.json' assert { type: 'json' };
const router = express.Router();

router.get('/', function(req, res) {
  res.json({version: 'umbrel-middleware-' + pjson.version});
});

export default router;
