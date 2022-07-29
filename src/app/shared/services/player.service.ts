/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import { Injectable } from '@angular/core';
// import {Player} from '../../../../shared/player';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap, take, tap } from 'rxjs';
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

  private filterPlayersByEmail(players: Player[], email: string): Player[] {
    return players.filter((player: Player) => player.email === email);
  }

  private updatePlayerForId(updatedPlayer: Player, existingPlayer: Player): any {
    existingPlayer.name = updatedPlayer.name;
    existingPlayer.nickName = updatedPlayer.nickName;
    const playerRef = doc(this.firestore, `players/${existingPlayer.id}`);
    return updateDoc(playerRef, existingPlayer as any);
  }
}
