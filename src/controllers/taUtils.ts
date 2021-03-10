import { db } from '../database';
import * as talib from 'talib-binding';

export async function RSI(coinId: number, candleToUse: string = 'close') {
    const { candleRepo } = db.getRepos();
    const dbRes = await candleRepo.find({
        where: [
            { coin: coinId},
        ]
    });

    let x = dbRes.map(y => y[candleToUse]);
    const output = talib.RSI(x, 3)

    return output;
}