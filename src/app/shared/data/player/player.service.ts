/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import { Injectable } from '@angular/core';
// import {Player} from '../../../../shared/player';
import { map, Observable, of } from 'rxjs';

import { Player } from '../../models/player';
import { Match } from '../../models/match';
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
      .pipe(map((players) => (players as Player[]).filter((player) => !player.hidden)));
  }

  savePlayer(player: Player): void {
    this.updatePlayerDoc({
      ...player,
      name: player.name,
      nickName: player.nickName,
      victorySongId: player.victorySongId,
      victorySongStart: player.victorySongStart,
    });
  }

  createPlayer(player: Player) {
    player.id = this.afs.createId();
    this.afs.collection('players').doc(player.id).set(player);
  }

  updatePlayersForMatch(players: Player[], match: Match): Observable<Player[]> {
    const winner = { ...players.find((player) => player.id === match.winnerId) } as Player;
    const loser = { ...players.find((player) => player.id === match.loserId) } as Player;
    if (winner && loser && match.winnerEndElo && match.loserEndElo) {
      winner.elo = match.winnerEndElo;
      winner.wins += 1;
      winner.decaying = false;
      loser.elo = match.loserEndElo;
      loser.losses += 1;
      loser.decaying = false;
      this.updatePlayerDoc(winner);
      this.updatePlayerDoc(loser);
      return of([winner, loser]);
    }
    return of([]);
  }

  private updatePlayerDoc(player: Player): void {
    this.afs.collection('players').doc(player.id).update(player);
  }
}
