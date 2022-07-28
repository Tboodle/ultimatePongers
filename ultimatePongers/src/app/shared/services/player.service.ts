/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import { Injectable } from '@angular/core';
// import {Player} from '../../../../shared/player';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
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
import { Player } from '../../../../../shared/player';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playerCollection;
  constructor(private firestore: Firestore) {
    this.playerCollection = collection(firestore, 'players');
  }

  public getPlayers(): Observable<any> {
    const collec = collectionData(this.playerCollection, { idField: 'id' });
    return collec;
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
          players.filter((player: Player) => player.email === email).length ===
          0
      )
    );
  }

  public registerPlayer(player: Player) {
    return addDoc(this.playerCollection, { ...player });
  }
}
