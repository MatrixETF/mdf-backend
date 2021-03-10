import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Coin } from './coin';

@Entity()
export class Price {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "float"})
    price: number;

    @Column({ 
        type: 'timestamp' ,
        default: new Date()
    })
    timestamp: Date;

    @Column({
        default: 'usd'
    })
    vs: string;

    @ManyToOne(() => Coin, coin => coin.candles)
    coin: Coin;
}