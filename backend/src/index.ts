import { ponder } from "ponder:registry";
import schema from "ponder:schema";

ponder.on("AppealContract:AppealCreated", async ({ event, context }) => {
  try {
    if (event.transaction.to === null) return;

    const { appealId, appealer, uri, startTime, endTime } = event.args;

    await context.db.insert(schema.appeals).values({
      id: appealId,
      appealerId: appealer,
      uri,
      startTime,
      endTime,
    });

    let user = await context.db.find(schema.users, { id: appealer });
    if (user && user.proposalCount !== null) {
      await context.db
        .update(schema.users, { id: appealer })
        .set({ proposalCount: user.proposalCount + 1 });
    } else {
      await context.db.insert(schema.users).values({
        id: appealer,
        proposalCount: 1,
        voteCount: 0,
      });
    }

    console.log(`AppealCreated processed successfully: ${appealId}`);
  } catch (error) {
    console.error("Error handling AppealCreated event:", error);
  }
});


ponder.on("AppealContract:voteCast", async ({ event, context }) => {

  if (event.transaction.to === null) return;

  try {
    const { appealId, voter, weight } = event.args;
    console.log(`VoteCast event received - Appeal: ${appealId}, Voter: ${voter}, Weight: ${weight}`);

    await context.db.insert(schema.votes).values({
      appealId,
      voterId: voter,
      weight,
    });

    let proposal = await context.db.find(schema.appeals, { id: appealId });
    if (proposal && proposal.forScore !== null && proposal.againstScore !== null) {
      console.log(
        `VoteCast - Proposal ${appealId}: Current Against Score: ${proposal.againstScore}, Incoming Weight: ${weight}`
      );

      const updatedForScore = proposal.forScore + BigInt(weight > 0 ? weight : 0);
      const updatedAgainstScore = proposal.againstScore + BigInt(weight < 0 ? -weight : 0);

      await context.db
        .update(schema.appeals, { id: appealId })
        .set({
          forScore: updatedForScore,
          againstScore: updatedAgainstScore,
        });

      const updatedProposal = await context.db.find(schema.appeals, { id: appealId });
      console.log(`Updated Proposal ${appealId}:`, updatedProposal);
    }

    let user = await context.db.find(schema.users, { id: voter });
    if (user && user.voteCount !== null) {
      await context.db
        .update(schema.users, { id: voter })
        .set({ voteCount: user.voteCount + 1 });
    } else {
      await context.db.insert(schema.users).values({
        id: voter,
        proposalCount: 0,
        voteCount: 1,
      });
    }

    console.log(`VoteCast processed and written successfully: ${appealId}`);
  } catch (error) {
    console.error("Error handling VoteCast event:", error);
  }
})

ponder.on("AppealContract:AppealExecuted", async ({ event, context }) => {

  if (event.transaction.to === null) return;

  try {
    const { appealId } = event.args;

    await context.db
      .update(schema.appeals, { id: appealId })
      .set({ executed: true });

    console.log(`ProposalExecuted processed successfully: ${appealId}`);
  } catch (error) {
    console.error("Error handling ProposalExecuted event:", error);
  }

})
