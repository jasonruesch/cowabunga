import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import 'firebase-admin';
import { AppModule } from './app/app.module';

const API_PREFIX = '/api';
const server = express();

function correctProxyUrl(req, _, next) {
  // Fix hosting rewriting issue
  if (req.url.indexOf(API_PREFIX) === 0) {
    req.url = req.url.replace(API_PREFIX, '');
    if (!req.url) {
      req.url = '/';
    }
  }
  next();
}

async function createNestServer(expressInstance) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance)
  );
  app.use(correctProxyUrl);
  return app.init();
}

createNestServer(server)
  .then(() => Logger.log('Nest ready'))
  .catch((err) => Logger.error(err));

// Connect express server to Firebase Functions
export const api = functions.https.onRequest(server);
