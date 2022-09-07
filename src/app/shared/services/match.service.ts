import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Match } from '../models/match';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { PlayerService } from './player.service';
import { Player } from '../models/player';
import { NewMatchAnimationComponent } from '../modals/new-match-animation/new-match-animation.component';

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  appViewRef: ViewContainerRef;
  newMatchAnimation: ComponentRef<NewMatchAnimationComponent>;

  constructor(private afs: AngularFirestore, private playerService: PlayerService) {
    afs
      .collection('matches', (ref) => ref.orderBy('date', 'desc').limit(10))
      .stateChanges(['added'])
      .pipe(
        map((docEvents: any[]) => {
          if (docEvents.length === 1) {
            const newMatch = docEvents[0].payload.doc.data() as Match;
            this.startNewMatchAnimation(newMatch);
          } else {
            // const newMatch = docEvents[0].payload.doc.data() as Match;
            // this.startNewMatchAnimation(newMatch);
          }
        }),
      )
      .subscribe();
  }

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

  public addMatch(match: Match): void {
    this.playerService.updatePlayersForMatch(match).subscribe((updatedMatch: Match) => {
      this.afs.collection('matches').add(updatedMatch);
    });
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

  private startNewMatchAnimation(match: Match) {
    const winner$ = this.playerService.getPlayerForId(match.winnerId);
    const loser$ = this.playerService.getPlayerForId(match.loserId);

    forkJoin([winner$, loser$]).subscribe((players: Player[]) => {
      const winner = players[0];
      const loser = players[1];

      this.newMatchAnimation = this.appViewRef.createComponent(NewMatchAnimationComponent);
      this.newMatchAnimation.instance.match = match;
      this.newMatchAnimation.instance.winner = winner;
      this.newMatchAnimation.instance.loser = loser;
      this.newMatchAnimation.instance.closeModal.subscribe(() => this.appViewRef.clear());
    });
  }
}
