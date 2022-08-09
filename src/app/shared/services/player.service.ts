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
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  ELO_CONST = 40;
  private playerCollection;
  constructor(private firestore: Firestore, private afs: AngularFirestore) {
    this.playerCollection = collection(firestore, 'players');
  }

  public getPlayers(): Observable<any> {
    return collectionData(this.playerCollection, { idField: 'id' });
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
        if (existingPlayers) {
          return this.afs.doc(`players/${player.id}`).update(player);
        }
        player.id = this.afs.createId()
        return this.afs.collection('players').doc(player.id).set(player);
      })
    );
  }

  updatePlayerElos(match: Match) {
    const winner$ = this.getPlayerForId(match.winnerId);
    const loser$ = this.getPlayerForId(match.loserId);
    forkJoin([winner$, loser$]).subscribe((players) => {
      const winner = players[0];
      const loser = players[1];

      const winnerRating = Math.pow(10, winner.elo / 400);
      const loserRating = Math.pow(10, loser.elo / 400);
  
      const winnerExpected = winnerRating / (loserRating + winnerRating)
      const loserExpected = loserRating / (loserRating + winnerRating)

      winner.wins += 1;
      const newWinnerScore = winner.elo + this.ELO_CONST * (1 - winnerExpected);
      winner.elo = Math.round(newWinnerScore * 10) / 10;
      this.afs.doc(`players\/${winner.id}`).update(winner);

      loser.losses += 1;
      const newLoserScore = loser.elo + this.ELO_CONST * (0 - loserExpected)
      loser.elo = Math.round(newLoserScore * 10) / 10;
      this.afs.doc(`players\/${loser.id}`).update(loser);
    });
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
}
