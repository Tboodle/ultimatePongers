/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import { Injectable } from '@angular/core';
// import {Player} from '../../../../shared/player';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { forkJoin, from, map, Observable, switchMap, take, tap } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDoc,
  query,
} from '@angular/fire/firestore';
import { updateDoc } from '@firebase/firestore';
import { Player } from '../models/player';
import { Match } from '../models/match';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playerCollection;
  constructor(private firestore: Firestore) {
    this.playerCollection = collection(firestore, 'players');
  }

  public getPlayers(): Observable<any> {
    return collectionData(this.playerCollection, { idField: 'id' });
  }

  public addWin(winnerId: string) {
    const playerRef = doc(this.firestore, `players/${winnerId}`);
    getDoc(playerRef).then((player) => {
      const playerData: any = player.data();
      playerData.wins = playerData.wins + 1;
      updateDoc(playerRef, playerData);
    });
  }

  public addLoss(loserId: string) {
    const playerRef = doc(this.firestore, `players/${loserId}`);
    getDoc(playerRef).then((player) => {
      const playerData: any = player.data();
      playerData.losses = playerData.losses + 1;
      updateDoc(playerRef, playerData);
    });
  }

  public emailNotRegistered(email: string): Observable<boolean> {
    return this.getPlayers().pipe(
      map(
        (players: Player[]) =>
          this.filterPlayersByEmail(players, email).length === 0
      )
    );
  }

  public savePlayer(player: Player): any {
    return this.getPlayers().pipe(
      take(1),
      switchMap((players: Player[]) => {
        const existingPlayers = this.filterPlayersByEmail(
          players,
          player.email
        );
        if (existingPlayers.length > 0) {
          return this.updatePlayerForId(player, existingPlayers[0]);
        } else {
          return addDoc(this.playerCollection, { ...player });
        }
      })
    );
  }

  updatePlayerElos(match: Match) {
    const winner$ = this.getPlayerForId(match.winnerId);
    const loser$ = this.getPlayerForId(match.loserId);
    forkJoin([winner$, loser$]).subscribe((players) => {
      const winner = players[0];
      const loser = players[1];
      const winnerProb = this.winningProbability(winner, loser);
      const loserProb = this.winningProbability(winner, loser);
      const eloConst = 40;
      winner.elo = winner.elo + eloConst * (1 - winnerProb);
      loser.elo = loser.elo + eloConst * (0 - loserProb);
      this.updatePlayerForId(winner, winner);
      this.updatePlayerForId(loser, loser);
    });
  }

  private winningProbability(player: Player, opponent: Player) {
    return (
      (1.0 * 1.0) /
      (1 + 1.0 * Math.pow(10, (1.0 * (player.elo - opponent.elo)) / 400))
    );
  }

  private getPlayerForId(id: string) {
    const playerRef = doc(this.firestore, `players/${id}`);
    return from(getDoc(playerRef)).pipe(
      map((player) => player.data() as Player)
    );
  }

  private filterPlayersByEmail(players: Player[], email: string): Player[] {
    return players.filter((player: Player) => player.email === email);
  }

  private updatePlayerForId(
    updatedPlayer: Player,
    existingPlayer: Player
  ): any {
    existingPlayer.name = updatedPlayer.name;
    existingPlayer.nickName = updatedPlayer.nickName;
    const playerRef = doc(this.firestore, `players/${existingPlayer.id}`);
    return updateDoc(playerRef, existingPlayer as any);
  }
}
