import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Match } from '../models/match';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  constructor(private afs: AngularFirestore, private playerService: PlayerService) {}

  public getMatches(): Observable<Match[]> {
    return this.afs
      .collection('matches', (ref) => ref.orderBy('date', 'desc').limit(10))
      .valueChanges()
      .pipe(
        map((matches: any[]) => {
          return matches.map((match) => {
            return { ...match, date: new Date(match.date?.seconds * 1000) };
          }) as Match[];
        }),
      );
  }

  public addMatch(match: Match): void {
    this.playerService.updatePlayersForMatch(match);
    this.afs.collection('matches').add(match);
  }
}
