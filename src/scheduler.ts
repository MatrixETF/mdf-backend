const cron = require('node-cron');
import { storePricesCoins, importCoinAndCandles } from './controllers/coinPopulator';

const jobs : Array<any>= [];

enum Every {
    second = "* * * * * *",
    minute = "* * * * *",
    minutes15 = "*/15 * * * *",
    halfHour = "*/30 * * * *",
    hour = "0 * * * *",
    twelveHours = "0 */12 * * *",
    day = "0 0 * * *", //At 00:00
    weekDay = "0 0 * * 1-5", //Monday to Friday.
    weekend = "0 0 * * 6,0", //Saturday and Sunday
    week = "0 0 * * 0",
    month = "0 0 1 * *",
    otherMonth = "0 0 1 */2 *",
    quarter = "0 0 1 */3 *",
    sixMonth = "0 0 1 */6 *",
    year = "0 0 1 1 *"
}

export function setupScheduler() {
    let job = cron.schedule(Every.hour, storePricesCoins);
    jobs.push(job);

    job = cron.schedule(Every.day, importCoinAndCandles);
    jobs.push(job);
}
