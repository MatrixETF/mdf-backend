import {BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, AfterLoad} from "typeorm";
import { findOrInsert } from "../controllers/coinPopulator";
import { db } from "../database";
import { Weight } from "./Weight";

@Entity()
export class mdf extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: false
    })
    isDeployed: boolean;

    @ManyToMany(() => Weight, weight => weight.mdfs, {
        eager: true
    })
    @JoinTable()
    contains: Weight[];

    @AfterLoad()
    getNav() {
        let value = 0;
        this.contains.forEach( entry => {
            value += (1 * (entry.percentage / 100)) * entry.coin.prices[0].price
        })
        console.log('value', value);
        return value
    }
    
}

export async function createmdf (_weights: any[]) {
    let weights: Weight[] = [];
    let total = 0;
    _weights.forEach( async entry => {
        total += entry.percentage;
        let coin = await findOrInsert(entry.coingeckoId);

        let w = new Weight();
        w.percentage = entry.percentage;
        w.coin = coin;
        weights.push(w);
    })

    if( total != 100) {
        console.log('Error: weights are not 100', total);
        return false;
    }

    const { weightsRepo, mdfsRepo } = db.getRepos();
    await weightsRepo.save(weights);

    let mdf = new mdf();
    mdf.contains = weights;

    await mdfsRepo.save(mdf);

    return mdf;
}