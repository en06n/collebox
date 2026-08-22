import 'dotenv/config';

import { db, client } from '@/db';
import { items } from '@/db/schema';

async function main() {

    // select
    const result = await db.select().from(items);

    // insert
    /*
    const result = await db.insert(items).values({
        name: '10th Anniversary トレーディング缶バッジ(White)',
        quantity: 6,
        targetQuantity: 6,
        releaseYear: 2021,
        externalUrl: 'https://www.suruga-ya.jp/product/detail/871066492?tenpo_cd='
    }).returning();;
    */

    console.log(result);

    await client.end();
}

main();