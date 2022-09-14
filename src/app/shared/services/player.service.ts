/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import { Injectable } from '@angular/core';
// import {Player} from '../../../../shared/player';
import { forkJoin, map, Observable } from 'rxjs';

import { Player } from '../models/player';
import { Match } from '../models/match';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  ELO_CONST = 40;

  constructor(private afs: AngularFirestore) {}

  getPlayers(): Observable<Player[]> {
    return this.afs
      .collection('players')
      .valueChanges({ idField: 'id' })
      .pipe(map((players) => players as Player[]));
  }

  getPlayerForId(id: string): Observable<Player> {
    return this.afs
      .collection('players')
      .doc(id)
      .get()
      .pipe(map((docSnapshot) => docSnapshot.data() as Player));
  }

  getPlayerForEmail(email: string): Observable<Player> {
    return this.afs
      .collection('players', (ref) => ref.where('email', '==', email))
      .get()
      .pipe(map((querySnapshot) => querySnapshot.docs[0]?.data() as Player));
  }

  savePlayer(player: Player): void {
    this.getPlayerForEmail(player.email).subscribe((existingPlayer: Player) => {
      if (existingPlayer) {
        this.updatePlayerDoc({
          ...existingPlayer,
          name: player.name,
          nickName: player.nickName,
          victorySongId: player.victorySongId,
          victorySongStart: player.victorySongStart,
        });
      } else {
        player.id = this.afs.createId();
        this.afs.collection('players').doc(player.id).set(player);
      }
    });
  }

  updatePlayersForMatch(match: Match): Observable<Match> {
    const winner$ = this.getPlayerForId(match.winnerId);
    const loser$ = this.getPlayerForId(match.loserId);

    return forkJoin([winner$, loser$]).pipe(
      map((players: Player[]) => {
        const winner = players[0];
        const loser = players[1];
        const winnerRating = Math.pow(10, winner.elo / 400);
        const loserRating = Math.pow(10, loser.elo / 400);
        const winnerModifier = 1 - winnerRating / (loserRating + winnerRating);
        const loserModifier = 0 - loserRating / (loserRating + winnerRating);

        //Gross
        const updatedWinnerElo = this.updatePlayerWithEloModifier(winner, winnerModifier);
        const updatedLoserElo = this.updatePlayerWithEloModifier(loser, loserModifier);
        match.winnerEndElo = updatedWinnerElo;
        match.loserEndElo = updatedLoserElo;
        return match;
        //End Gross
      }),
    );
  }

  private updatePlayerWithEloModifier(player: Player, eloModifier: number): number {
    const newLoserScore = player.elo + this.ELO_CONST * eloModifier;
    player.elo = Math.round(newLoserScore * 10) / 10;
    if (eloModifier >= 0) {
      player.wins += 1;
    } else {
      player.losses += 1;
    }
    this.updatePlayerDoc(player);
    return player.elo;
  }

  private updatePlayerDoc(player: Player): void {
    this.afs.collection('players').doc(player.id).update(player);
  }
}
