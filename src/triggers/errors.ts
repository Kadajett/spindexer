import { Table } from '../db/db';
import { Trigger } from '../types/trigger';

const NUMBER_OF_RETRIES = parseInt(process.env.NUMBER_OF_ERROR_RETRIES!);

export const errorRetry: Trigger<undefined> = async (clients) => {
  const nftQuery = `select * 
  from "${Table.erc721nftProcessErrors}"
  where "numberOfRetries" < '${NUMBER_OF_RETRIES}'
  limit ${parseInt(process.env.QUERY_TRIGGER_BATCH_SIZE!)}
`
  const nfts = (await clients.db.rawSQL(nftQuery))
    .rows.slice(0, parseInt(process.env.QUERY_TRIGGER_BATCH_SIZE!));
  return nfts;

};
