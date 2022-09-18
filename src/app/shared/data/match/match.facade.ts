import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Match } from '../../models/match';
import { UpdatePlayersForMatchAction } from '../player/player.actions';
import {
  AddMatchAction,
  FetchMachesForPlayerIdAction,
  FetchMatchesAction,
  WatchForNewMatchAction,
} from './match.actions';
import { MatchState } from './match.state';

@Injectable({
  providedIn: 'root',
})
export class MatchFacade {
  @Select(MatchState.getMatches) matches$: Observable<Match[]>;

  @Select(MatchState.getMatchesByPlayerId) matchesByPlayerId$: Observable<{
    [id: string]: Match[];
  }>;

  @Select(MatchState.getNewMatch) newMatch$: Observable<Match>;

  constructor(private store: Store) {
    this.store.dispatch(new WatchForNewMatchAction());
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
