import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Coin } from './coin';

@Entity()
export class Candle {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, type: "float"})
    open: number;

    @Column({ nullable: true, type: "float"})
    high: number;

    @Column({ nullable: true, type: "float"})
    low: number;

    @Column({ nullable: true, type: "float"})
    close: number;

    @Column({ type: 'timestamp' })
    timestamp: Date;

    @Column({
        unique: true
    })
    hash: string;

    @Column({
        default: 'usd'
    })
    vs: string;

    @ManyToOne(() => Coin, coin => coin.candles)
    coin: Coin;
}