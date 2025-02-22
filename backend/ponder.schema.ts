import { onchainTable, relations } from "ponder";
export const users = onchainTable("users", (t) => ({
  id: t.text().primaryKey(),
  proposalCount: t.integer().default(0),
  voteCount: t.integer().default(0),
}));

export const appeals = onchainTable("proposals", (t) => ({
  id: t.bigint().primaryKey(),
  appealerId: t.text().notNull(),
  uri: t.text(),
  startTime: t.bigint(),
  endTime: t.bigint(),
  forScore: t.bigint().default(BigInt(0)),
  againstScore: t.bigint().default(BigInt(0)),
  executed: t.boolean().default(false),
}));
export const votes = onchainTable("votes", (t) => ({
  appealId: t.bigint().notNull(),
  voterId: t.text().notNull().primaryKey(),
  weight: t.bigint(),
}));

export const usersRelations = relations(users, ({ many }) => ({
  appeals: many(appeals),
  votes: many(votes),
}));

export const appealsRelations = relations(appeals, ({ one, many }) => ({
  proposer: one(users, { fields: [appeals.appealerId], references: [users.id] }),
  votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  voter: one(users, { fields: [votes.voterId], references: [users.id] }),
  proposal: one(appeals, { fields: [votes.appealId], references: [appeals.id] }),
}));
