import { Injectable, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Match } from '../models/match';
import {
  addDoc,
  collection,
  collectionData,
  collectionGroup,
  Firestore,
} from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PlayerService } from './player.service';

@Injectable({
  providedIn: 'root',
})
export class MatchService implements OnInit {
  private matchCollection;
  constructor(
    private afs: AngularFirestore,
    private playerService: PlayerService
  ) {
    this.matchCollection = afs.collection<Match>('matches', (ref) =>
      ref.orderBy('date', 'desc').limit(100)
    );
  }

  ngOnInit(): void {}

  public getMatches(): Observable<any> {
    return this.matchCollection.valueChanges().pipe(
      map((matches: any[]) => {
        return matches.map((match) => {
          return { ...match, date: new Date(match.date?.seconds * 1000) };
        });
      })
    );
  }

  public addMatch(match: Match): any {
    this.playerService.addWin(match.winnerId);
    this.playerService.addLoss(match.loserId);
    this.playerService.updatePlayerElos(match);
    return this.matchCollection.add(match);
  }
}
