import {
    pgTable,
    uuid,
    text,
    integer,
    timestamp,
} from 'drizzle-orm/pg-core';

export const items = pgTable('items', {
    id: uuid('id').defaultRandom().primaryKey(),

    name: text('name').notNull(),

    quantity: integer('quantity').notNull().default(0),

    targetQuantity: integer('target_quantity').default(1),

    releaseYear: integer('release_year'),

    externalUrl: text('external_url'),

    createdAt: timestamp('created_at').defaultNow().notNull(),

    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});