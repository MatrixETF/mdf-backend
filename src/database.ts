import { Weight } from './entities/Weight';
import { mdf } from './entities/mdf';
import { createConnection, Repository, Connection } from 'typeorm';
import {Coin} from './entities/coin';
import { Candle } from './entities/candle';
import { Price } from './entities/price';

let connection: Connection;
let coinsRepo: Repository<Coin>;
let candleRepo: Repository<Candle>;
let pricesRepo: Repository<Price>;
let mdfsRepo: Repository<mdf>;
let weightsRepo: Repository<Weight>;


export const connectDB = async () => {
    connection = await createConnection();
    coinsRepo = connection.getRepository(Coin);
    candleRepo = connection.getRepository(Candle);
    pricesRepo = connection.getRepository(Price);
    mdfsRepo = connection.getRepository(mdf);
    weightsRepo = connection.getRepository(Weight);
};

const getRepos = () => {
    return {
        coinsRepo,
        candleRepo,
        pricesRepo,
        mdfsRepo,
        weightsRepo
    }
}

export const db = {
    getRepos
}