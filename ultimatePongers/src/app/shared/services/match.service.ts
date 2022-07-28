import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Match } from '../../../../../shared/match';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private matchCollection;
  constructor(firestore: Firestore, private playerService: PlayerService) {
    this.matchCollection = collection(firestore, 'matches');
  }

  public getMatches(): Observable<any> {
    return collectionData(this.matchCollection).pipe(
      map((matches: any[]) => {
        return matches.map((match) => {
          return { ...match, date: new Date(match.date?.seconds * 1000) };
        });
      }),
      map((matches: Match[]) =>
        matches.sort(
          (match1, match2) => match2.date.valueOf() - match1.date.valueOf()
        )
      )
    );
  }

  public addMatch(match: Match): any {
    this.playerService.addWin(match.winnerId);
    this.playerService.addLoss(match.loserId);
    return addDoc(this.matchCollection, { ...match });
  }
}
