import express from 'express';
import {readFile} from 'node:fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';

let appConfig = {};

async function loadConfig() {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, '..', 'package.json');
    const data = await readFile(filePath, {encoding: 'utf8'});
    appConfig = JSON.parse(data);
  } catch (error) {
    console.error('Failed to read or parse the JSON file:', error);
  }
}

loadConfig();

const router = express.Router();

router.get('/', function(req, res) {
  res.json({version: 'umbrel-middleware-' + appConfig.version});
});

export default router;
