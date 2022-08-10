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
  constructor(private afs: AngularFirestore) { }

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
        this.updatePlayerDoc({ ...existingPlayer, name: player.name, nickName: player.nickName });
      } else {
        player.id = this.afs.createId();
        this.afs.collection('players').doc(player.id).set(player);
      }
    });
  }

  updatePlayersForMatch(match: Match): void {
    const winner$ = this.getPlayerForId(match.winnerId);
    const loser$ = this.getPlayerForId(match.loserId);

    forkJoin([winner$, loser$]).subscribe((players) => {
      const winner = players[0];
      const loser = players[1];
      const winnerRating = Math.pow(10, winner.elo / 400);
      const loserRating = Math.pow(10, loser.elo / 400);
      const winnerModifier = 1 - winnerRating / (loserRating + winnerRating);
      const loserModifier = 0 - loserRating / (loserRating + winnerRating);
      this.updatePlayerWithEloModifier(winner, winnerModifier);
      this.updatePlayerWithEloModifier(loser, loserModifier);
    });
  }

  private updatePlayerWithEloModifier(
    player: Player,
    eloModifier: number
  ): void {
    const newLoserScore = player.elo + this.ELO_CONST * eloModifier;
    player.elo = Math.round(newLoserScore * 10) / 10;
    eloModifier >= 0 ? (player.wins += 1) : (player.losses += 1);
    this.updatePlayerDoc(player);
  }

  private updatePlayerDoc(player: Player): void {
    this.afs.collection('players').doc(player.id).update(player);
  }
}
