import { Injectable, ViewContainerRef } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { Match } from '../../models/match';
import { UpdatePlayersForMatchAction } from '../player/player.actions';
import { AddMatchAction, FetchMachesForPlayerIdAction, FetchMatchesAction } from './match.actions';
import { MatchState } from './match.state';

@Injectable({
  providedIn: 'root',
})
export class MatchFacade {
  appViewRef: ViewContainerRef;
  @Select(MatchState.getMatches) matches$: Observable<Match[]>;

  @Select(MatchState.getMatchesByPlayerId) matchesByPlayerId$: Observable<{
    [id: string]: Match[];
  }>;

  constructor(private store: Store, private matchState: MatchState) {
    matchState.appViewRef = this.appViewRef;
  }

  fetchMatches(): Observable<any> {
    return this.store.dispatch(new FetchMatchesAction());
  }

  fetchMatchesForId(id: string): Observable<any> {
    return this.store.dispatch(new FetchMachesForPlayerIdAction(id));
  }

  addMatch(match: Match): void {
    this.store.dispatch(new UpdatePlayersForMatchAction(match));
    this.store.dispatch(new AddMatchAction(match));
  }
}
