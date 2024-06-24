// require('module-alias/register');
// require('module-alias').addPath('.');
// require('dotenv').config();

// const express = require('express');
// const path = require('path');
// const morgan = require('morgan');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const environment = process.env.NODE_ENV;

// // Keep requestCorrelationId middleware as the first middleware. Otherwise we risk losing logs.
// const requestCorrelationMiddleware = require('middlewares/requestCorrelationId.js'); // eslint-disable-line id-length
// const camelCaseReqMiddleware = require('middlewares/camelCaseRequest.js').camelCaseRequest;
// const errorHandleMiddleware = require('middlewares/errorHandling.js');

// const logger = require('utils/logger.js');

// const monerod = require('routes/v1/monerod/info.js');
// const charts = require('routes/v1/monerod/charts.js');
// const system = require('routes/v1/monerod/system.js');
// const ping = require('routes/ping.js');
// const app = express();

// // Handles CORS
// app.use(cors());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// app.use(requestCorrelationMiddleware);
// app.use(camelCaseReqMiddleware);

// if (environment === 'development') {
//   app.use(morgan('dev', logger.morganConfiguration));

// } else {
//   app.use(morgan('combined', logger.morganConfiguration));
//   app.use(express.static(path.join(__dirname, 'public')));
//   app.use('/', express.static('./ui/dist'));
// }

// app.use('/v1/monerod/info', monerod);
// app.use('/v1/monerod/info', charts);
// app.use('/v1/monerod/system', system);
// app.use('/ping', ping);

// app.use(errorHandleMiddleware);
// app.use((req, res) => {
//   res.status(404).json(); // eslint-disable-line no-magic-numbers
// });

// module.exports = app;


// import 'module-alias/register';
// import moduleAlias from 'module-alias';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';
// import cors from 'cors';

import * as requestCorrelationMiddleware  from './middlewares/requestCorrelationId.js';
import { camelCaseRequest as camelCaseReqMiddleware } from './middlewares/camelCaseRequest.js';
import * as errorHandleMiddleware from './middlewares/errorHandling.js';
import * as logger from './utils/logger.js';
import * as monerod from './routes/v1/monerod/info.js';
import * as charts from './routes/v1/monerod/charts.js';
import * as system from './routes/v1/monerod/system.js';
import * as ping from './routes/ping.js';

import { addAlias } from 'module-alias';

import { fileURLToPath } from 'url';
import { dirname } from 'path';


// import helmet from 'helmet'



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

addAlias('module-alias/register');
dotenv.config();

const environment = process.env.NODE_ENV;
const app = express();

// app.use(helmet());

// temporarily disable contentSecurityPolicy
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//   })
// );
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(requestCorrelationMiddleware.default);
app.use(camelCaseReqMiddleware);

if (environment === 'development') {
  app.use(morgan('dev', logger.morganConfiguration));
} else {
  app.use(morgan('combined', logger.morganConfiguration));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/', express.static('./ui/dist'));
}

app.use('/v1/monerod/info', monerod.default);
app.use('/v1/monerod/info', charts.default);
app.use('/v1/monerod/system', system.default);
app.use('/ping', ping.default);

app.use(errorHandleMiddleware.default);
app.use((req, res) => {
  res.status(404).json();
});

export default app;