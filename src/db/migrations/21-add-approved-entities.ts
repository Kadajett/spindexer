
import { Knex } from 'knex'

import { Table } from '../db'
import { updateViews } from '../migration-helpers'

export const up = async (knex: Knex) => {

  // add approved column
  const shouldAlterMetaFactories = !(await knex.schema.hasColumn(Table.metaFactories, 'autoApprove'))
  const shouldAlterNftFactories = !(await knex.schema.hasColumn(Table.nftFactories, 'autoApprove'))
  const shouldAlterNfts = !(await knex.schema.hasColumn(Table.nfts, 'approved'))

  if (shouldAlterMetaFactories){
    await knex.schema.alterTable(Table.metaFactories, table => {
      table.boolean('autoApprove').defaultTo(false)
    })
  }
  if (shouldAlterNftFactories){
    await knex.schema.alterTable(Table.nftFactories, table => {
      table.boolean('autoApprove').defaultTo(false)
    })
  }
  if (shouldAlterNfts){
    await knex.schema.alterTable(Table.nfts, table => {
      table.boolean('approved').defaultTo(false)
    })
  }

  // set all existing entities to approved = true
  await knex(Table.metaFactories).update({ autoApprove: true })
  await knex(Table.nftFactories).update({ autoApprove: true })
  await knex(Table.nfts).update({ approved: true }).whereNotIn('platformId', ['zora', 'zoraOriginal'])

  await updateViews(knex);
}

export const down = async (knex: Knex) => {
 
  await knex.schema.alterTable(Table.metaFactories, table => {
    table.dropColumn('autoApprove')
  })
  await knex.schema.alterTable(Table.nftFactories, table => {
    table.dropColumn('autoApprove')
  })
  await knex.schema.alterTable(Table.nfts, table => {
    table.dropColumn('approved')
  })

}
