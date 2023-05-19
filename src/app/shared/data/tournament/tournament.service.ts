/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import { Injectable } from '@angular/core';
// import {Player} from '../../../../shared/player';
import { from, map, Observable } from 'rxjs';

import { Tournament } from '../../models/tournament';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class TournamentService {
  constructor(private afs: AngularFirestore) {}

  getTournaments(): Observable<Tournament[]> {
    return this.afs
      .collection('tournaments')
      .valueChanges({ idField: 'id' })
      .pipe(
        map(
          (tournaments: any[]) =>
            tournaments.map((tournament) => {
              return { ...tournament, startDate: new Date(tournament.startDate?.seconds * 1000) };
            }) as Tournament[],
        ),
      );
  }

  createTournament(tournament: Tournament): Observable<any> {
    return from(this.afs.collection('tournaments').add(tournament));
  }

  addPlayerToTournament(tournament: Tournament, playerId: string): Observable<any> {
    return from(
      this.afs
        .collection('tournaments')
        .doc(tournament.id)
        .set({ ...tournament, competitors: [...tournament.competitors, playerId] }),
    );
  }
}
