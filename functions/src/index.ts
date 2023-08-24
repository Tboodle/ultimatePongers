import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
import * as moment from 'moment';

// The Firebase Admin SDK to delete inactive users.
import admin = require('firebase-admin');
admin.initializeApp();

export const scheduledDecay = onSchedule('every monday 00:00', async () => {
  // Get all users -> Filter for those that havent played in over a month and whose elo > 400
  const db = admin.firestore();
  (await db.collection('players').get()).docs
    .map((doc) => doc.data())
    .forEach(async (player) => {
      //   const oldPlayer = { ...player };
      const mostRecentWinDocs = await (
        await db
          .collection('matches')
          .where('winnerId', '==', player.id)
          .orderBy('date', 'desc')
          .limit(1)
          .get()
      ).docs;
      const mostRecentLossDocs = await (
        await db
          .collection('matches')
          .where('loserId', '==', player.id)
          .orderBy('date', 'desc')
          .limit(1)
          .get()
      ).docs;

      let mostRecentWinDate = null;
      if (mostRecentWinDocs.length > 0) {
        const mostRecentWinData = mostRecentWinDocs[0].data();
        mostRecentWinDate = new Date(mostRecentWinData.date.seconds * 1000);
      }
      mostRecentWinDate = mostRecentWinDate ?? new Date(0);

      let mostRecentLossDate = null;
      if (mostRecentLossDocs.length > 0) {
        const mostRecentLossData = mostRecentLossDocs[0].data();
        mostRecentLossDate = new Date(mostRecentLossData.date.seconds * 1000);
      }
      mostRecentLossDate = mostRecentLossDate ?? new Date(0);

      const mostRecentMatchDate = moment(
        mostRecentWinDate >= mostRecentLossDate ? mostRecentWinDate : mostRecentLossDate,
      );
      const currentDate = moment(new Date());
      const weeksBetween = currentDate.diff(mostRecentMatchDate, 'week');

      if (player.elo > 400 && weeksBetween > 3) {
        const decayedElo = player.elo - Math.pow(2, weeksBetween - 3);
        const newElo = decayedElo < 400 ? 400 : decayedElo;
        const newPlayer = { ...player, elo: newElo, decayedFrom: player.elo, decaying: true };
        console.log(
          `${
            player.name
          } has decayed to ${newElo} elo because they were inactive for ${weeksBetween} weeks. This was a drop of ${
            player.elo - newElo
          } elo`,
        );
        // await db.collection('players').doc(player.id).set(newPlayer);
      }
    });

  // For each of those, calculate new elo based off time since last game (decay 2^(weeksSinceLast - 3))
  logger.log('Scheduled player decay finished');
});
