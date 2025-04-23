process.env.NODE_ENV = 'test';

import supertest from 'supertest';
import app from '../app.js';
import * as systemLogic from '../logic/system.js';

// Configure supertest
global.requester = supertest(app);

// Mock the system logic
global.systemLogic = systemLogic;
