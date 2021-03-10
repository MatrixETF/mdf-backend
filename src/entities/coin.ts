import { Candle } from './candle';
import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Price } from './price';

@Entity()
export class Coin {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    symbol: string;

    @Column({
        unique: true,
        nullable: true
    })
    contractAddress: string;

    @Column()
    name: string;

    @Column({
        unique: true,
    })
    coingeckoId: string;

    @Column({
        default: false
    })
    ismdf: boolean;

    @OneToMany(() => Candle, candle => candle.coin)
    candles: Candle[]

    @OneToMany(() => Price, price => price.coin, {
        eager: true
    })
    prices: Price[]
    
}