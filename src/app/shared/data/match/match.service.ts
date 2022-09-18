import { Injectable } from '@angular/core';
import { forkJoin, from, map, Observable } from 'rxjs';
import { Match } from '../../models/match';

import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(private afs: AngularFirestore) {}

  public getMatches(): Observable<Match[]> {
    return this.afs
      .collection('matches', (ref) => ref.orderBy('date', 'desc').limit(10))
      .valueChanges()
      .pipe(
        map(
          (matches: any[]) =>
            matches.map((match) => {
              return { ...match, date: new Date(match.date?.seconds * 1000) };
            }) as Match[],
        ),
      );
  }

  public getMatchesForId(id: string): Observable<Match[]> {
    const wins$: Observable<Match[]> = this.afs
      .collection('matches', (ref) => ref.where('winnerId', '==', id))
      .get()
      .pipe(map((winResponse) => winResponse.docs.map((doc) => doc.data()) as Match[]));

    const losses$: Observable<Match[]> = this.afs
      .collection('matches', (ref) => ref.where('loserId', '==', id))
      .get()
      .pipe(map((winResponse) => winResponse.docs.map((doc) => doc.data()) as Match[]));

    return forkJoin([wins$, losses$]).pipe(
      map(([wins, losses]) =>
        wins
          .concat(losses)
          .sort((matchA: Match, matchB: Match) => matchB.date.seconds - matchA.date.seconds),
      ),
      map(
        (matches: any[]) =>
          matches.map((match) => {
            return { ...match, date: new Date(match.date?.seconds * 1000) };
          }) as Match[],
      ),
    );
  }

  public addMatch(match: Match): Observable<any> {
    return from(this.afs.collection('matches').add(match));
  }

  public watchForNewMatch(): Observable<Match> {
    return this.afs
      .collection('matches', (ref) => ref.orderBy('date', 'desc').limit(10))
      .stateChanges(['added'])
      .pipe(
        map((docEvents: any[]) => {
          if (docEvents.length === 1) {
            return docEvents[0].payload.doc.data() as Match;
          } else {
            return {} as Match;
            // return (newMatch = docEvents[0].payload.doc.data() as Match);
            // this.startNewMatchAnimation(newMatch);
          }
        }),
      );
  }
}
