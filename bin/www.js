#!/usr/bin/env node

/**
 * Module dependencies.
 */

import * as app from '../app.js';
import debug from 'debug';
import http from 'http';

import * as diskLogic from '../logic/disk.js';
import * as diskService from '../services/disk.js';
import * as monerodLogic from '../logic/monerod.js';
import * as constants from '../utils/const.js';

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '8889');
app.default.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app.default);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Function to create default monero config files if they do not already exist.
 */

async function createConfFilesAndRestartMonerod() {
  console.log('bitmonero.conf does not exist, creating config files with DEFAULT values!');

  try{
    const config = await diskLogic.getJsonStore();
    await diskLogic.applyCustomMoneroConfig(config, true);
  } catch (error) {
    console.log(error);
    return;
  }

  //Verify config file was created successfully and matches the default values
  if (! await diskService.fileExists(constants.MONERO_CONF_FILEPATH)) {
    console.log('Failed to create bitmonero.conf');
    return;
  } else {
    console.log('bitmonero.conf now exists');
  }
  
  const MAX_TRIES = 10;
  let tries = 0;
  
  while (tries < MAX_TRIES) {
    const status = await monerodLogic.getStatus();
    if (status.operational){
      try {
        await monerodLogic.stop();
        console.log('Monerod stopped');
        break;
      } catch (error) {
        console.log(`Attempt ${tries + 1} to stop monerod failed:`, error);

      }
    }else{
      console.log(`Monerod is not connected, retrying in ${2 ** tries} seconds...`);
    }
    tries++;
    await new Promise((resolve) => setTimeout(resolve, 2 ** tries * 1000));
  }
  if (tries === MAX_TRIES) {
    console.log('Max attempts to stop monerod reached, giving up.');
  }
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

async function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
  await monerodLogic.getIsReady();

  // if bitmonero.conf does not exist, create default monero config files and restart monerod.
  if (! await diskService.fileExists(constants.MONERO_CONF_FILEPATH)) {
    createConfFilesAndRestartMonerod();
  }
}
