import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';
import 'firebase-admin';
import { AppModule } from './app/app.module';

const server = express();

async function createNestServer(expressInstance) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance)
  );
  return app.init();
}

createNestServer(server)
  .then(() => Logger.log('Nest ready'))
  .catch((err) => Logger.error(err));

// Connect express server to Firebase Functions
export const api = functions.https.onRequest(server);
