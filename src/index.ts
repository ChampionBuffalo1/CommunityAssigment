import 'dotenv-safe/config';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import v1Router from './routes';
import { Logger, errorResponse } from './utils';
import { API_PORT } from './Constants';
import { attachSession } from './middleware/attachSession';

(async () => {
  const app = express();
  app.disable('x-powered-by');
  app.use(
    cors(),
    helmet(),
    express.json(),
    express.urlencoded({
      extended: true,
    }),
    attachSession,
  );

  app.use('/v1', v1Router);

  app.get('/', (_, res) => res.sendStatus(200));
  app.all('*', (req, res) =>
    res.status(404).json(
      errorResponse({
        code: 'INVALID_ROUTE',
        message: `${req.method} ${req.url} not found`,
      }),
    ),
  );

  app.listen(API_PORT, () => Logger.info(`Server started at port ${API_PORT}`));

  process.on('unhandledRejection', (error: Error) =>
    Logger.error(`Unhandled Promise Rejection\nError: ${error.message || error}`),
  );
})();
