import 'dotenv/config';
import * as express from 'express';
import { connectDB, db } from './database';
import { setupScheduler } from './scheduler';
import { importCoinAndCandles } from './controllers/coinPopulator';

import { router as mdfRouter } from './controllers/mdf/routes';

const app = express();

app.use('/mdfs', mdfRouter);
app.get('/populateCoin/:coingeckoId', importCoinAndCandles);

app.get('/test', async (req, res) => {

  const { mdfsRepo } = db.getRepos();

  let mdfs = await mdfsRepo.find();

  res.status(200).json({
    mdfs
  });
});

const port: Number = Number(process.env.PORT) || 3000;
const startServer = async () => {
  await app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

(async () => {
  setupScheduler();
  await connectDB();
  await startServer();
})();