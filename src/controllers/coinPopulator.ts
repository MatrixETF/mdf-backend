import { db } from '../database';
const CoinGecko = require('coingecko-api');
import { Coin } from '../entities/coin';
import { Candle } from '../entities/candle';
import { Price } from '../entities/price';

export async function importCoinAndCandles(req, res) {
    try {
        const CoinGeckoClient = new CoinGecko();
        const { candleRepo } = db.getRepos();
        const coingeckoId = req.params.coingeckoId;
        let coin = await findOrInsert(coingeckoId);  
        
        const apiRes = await CoinGeckoClient._request(`/coins/${coingeckoId}/ohlc`, {
            vs_currency: 'usd',
            days: req.params.days || 1,
        });
        
        let candles;
        if(apiRes.success) {
            candles = apiRes.data.map(entry => {
                let timestamp = new Date(entry[0]);
                let open = entry[1];
                let high = entry[2];
                let low = entry[3];
                let close = entry[4];
                
                let candle = new Candle();
                
                candle.open = open;
                candle.high = high;
                candle.low = low;
                candle.close = close;
                candle.timestamp = timestamp;
                candle.coin = coin;
                candle.hash = Buffer.from(JSON.stringify([coin.id, timestamp, open, high, low, close])).toString('base64');
                return candle
            });

            if(candles.length) {
                //console.log(candles);
                candleRepo.save(candles);
            }
        }

        if(res && res.status) {
            res.status(200).json({
                candles,
            });
        }
    } catch(e) {
        console.log(e, e.message);
    }
}

export async function findOrInsert(_coingeckoId: string) {
    const CoinGeckoClient = new CoinGecko();
    const { coinsRepo } = db.getRepos();
    const coingeckoId = _coingeckoId;
    
    const dbRes = await coinsRepo.find({
        where: [
            { coingeckoId: coingeckoId},
        ]
    });
    
    let coin;
    if( dbRes.length ){
        coin = dbRes[0];
    } else {
        let resApi: any = await CoinGeckoClient.coins.fetch(coingeckoId, {});
        coin = new Coin();
        coin.symbol = resApi.data.symbol;
        coin.name = resApi.data.name;
        coin.coingeckoId = coingeckoId;
        await coinsRepo.save(coin);
        console.log("Coin has been saved");
    }

    return coin;
}

export async function storePricesCoins(req, res) {
    try {
        console.log('storePricesCoins');
        const CoinGeckoClient = new CoinGecko();
        const { coinsRepo, pricesRepo } = db.getRepos();

        let coins = await coinsRepo.find();
    
        let apiRes = await CoinGeckoClient.simple.price({
            ids: coins.map( o => o.coingeckoId),
            vs_currencies: ['usd'],
        });

        let prices: Array<any> = [];
        if(apiRes.success) {
            const priceMap = apiRes.data;
            coins.forEach( o => {
                let price = new Price();
                price.price = priceMap[o.coingeckoId].usd;
                price.coin = o;
                prices.push(price);
            });
            
            if(prices.length) {
                //console.log(candles);
                pricesRepo.save(prices);
            }
            
            if(res && res.status) {
                res.status(200).json({
                    prices,
                });
            }
        }
    } catch(e) {
        console.log(e, e.message);
    }
}