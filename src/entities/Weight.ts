import { Coin } from './coin';
import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToOne, JoinColumn} from "typeorm";
import { mdf } from './mdf';

@Entity()
export class Weight {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "float"})
    percentage: number;

    @OneToOne(() => Coin, {
        eager: true
    })
    @JoinColumn()
    coin: Coin;

    @ManyToMany(() => mdf, mdf => mdf.contains)
    mdfs: mdf[];
}