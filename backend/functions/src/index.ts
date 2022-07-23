import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Player} from "../../../shared/player";
import {Match} from "../../../shared/match";
import {uuid} from "uuidv4";

exports.addPlayer = functions.https.onCall(async (player: Player) => {
  const db = admin.firestore();

  await db.collection("players").doc(player.email).set({...player, id: uuid()})
      .then(() => {
        functions.logger.info("Player added: ", player.email);
      })
      .catch((error) => {
        functions.logger.error("Error creating new player for request: ",
            player);
        throw new functions.https.HttpsError(error.code, error.message);
      });
  return player;
});

exports.addMatch = functions.https.onCall(async (match: Match) => {
  const db = admin.firestore();
  const date = new Date();
  const id = uuid();

  await db.collection("matches").doc(id).set({...match, date, id: id})
      .then(() => {
        functions.logger.info("Match added: ", match.id);
      })
      .catch((error) => {
        functions.logger.error("Error creating new match for request: ", match);
        throw new functions.https.HttpsError(error.code, error.message);
      });
  return match;
});

exports.getPlayers = functions.https.onCall(async () => {
  console.log("Retrieving all players");
  const db = admin.firestore();
  const players: any[] = [];
  await db.collection("players").get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          players.push({id: doc.id, ...doc.data()});
        });
      })
      .catch((err) => {
        console.log("Error getting players", err);
        throw new functions.https.HttpsError(err.code, err.message);
      });
  return players;
});

exports.getMatches = functions.https.onCall(async () => {
  console.log("Retrieving all matches");
  const db = admin.firestore();
  const matches: any[] = [];
  await db.collection("matches").get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          matches.push({id: doc.id, ...doc.data()});
        });
      })
      .catch((err) => {
        console.log("Error getting players", err);
        throw new functions.https.HttpsError(err.code, err.message);
      });
  return matches;
});
