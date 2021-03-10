import * as express from 'express';
import { db } from '../../database';
import * as _ from 'lodash';
export const router = express.Router();

// Home page route.
router.get('/', function (req, res) {
  res.send('mdf Router');
})

router.get('/getAll', async function (req, res) {
    const { mdfsRepo } = db.getRepos();
    let mdfs = _.filter(await mdfsRepo.find(), (o) => o.contains.length > 0);

    // let navPerformance = [];
    // for (let index = 0; index < mdfs.contains.length; index++) {
    //     const weight = mdfs.contains[index];
    // }

    let arr: any[] = mdfs.map( p => {
        return {
            ...p,
            nav: p.getNav(),
            contains: p.contains.map( c => {
                return {
                    ...c,
                    coin: {
                        ...c.coin,
                        last_price: _.head(c.coin.prices).price
                    }
                }
            })
        }
    });

    res.status(200).json({
        arr
    });
})


