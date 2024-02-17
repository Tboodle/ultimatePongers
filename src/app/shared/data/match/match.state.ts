import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { filter } from 'rxjs';
import { Match } from '../../models/match';
import { UpdatePlayersForMatchAction } from '../player/player.actions';
import {
  AddLiveMatchAction,
  AddMatchAction,
  FetchLiveMatchesAction,
  FetchMachesForPlayerIdAction,
  FetchMatchesAction,
  WatchForNewMatchAction,
} from './match.actions';
import { MatchService } from './match.service';
import { LiveMatch } from '../../models/liveMatch';

export interface MatchStateModel {
  recentMatches: Match[];
  matchesByPlayerId: { [key: string]: any };
  newMatch?: Match;
  liveMatches?: LiveMatch[];
}

@State<MatchStateModel>({
  name: 'match',
  defaults: {
    recentMatches: [],
    liveMatches: [],
    matchesByPlayerId: {},
    newMatch: undefined,
  },
})
@Injectable()
export class MatchState {
  ELO_CONST = 40;

  constructor(private store: Store, private matchService: MatchService) {}

  @Selector()
  static getMatches(state: MatchStateModel) {
    return state.recentMatches;
  }

  @Selector()
  static getMatchesByPlayerId(state: MatchStateModel) {
    return state.matchesByPlayerId;
  }

  @Selector()
  static getNewMatch(state: MatchStateModel) {
    return state.newMatch;
  }

  @Selector()
  static getLiveMatches(state: MatchStateModel) {
    return state.liveMatches;
  }

  @Action(FetchMatchesAction)
  fetchMatches(ctx: StateContext<MatchStateModel>) {
    const state = ctx.getState();
    this.matchService.getMatches().subscribe((matches: Match[]) => {
      ctx.patchState({
        recentMatches: matches.concat(state.recentMatches),
      });
    });
  }

  @Action(FetchLiveMatchesAction)
  fetchLiveMatches(ctx: StateContext<MatchStateModel>) {
    const state = ctx.getState();
    this.matchService.getLiveMatches().subscribe((liveMatches: LiveMatch[]) => {
      ctx.patchState({
        liveMatches: liveMatches.concat(state.liveMatches),
      });
    });
  }

  @Action(AddMatchAction)
  addMatch(ctx: StateContext<MatchStateModel>, action: AddMatchAction) {
    const state = ctx.getState();
    const updatedMatch = this.setMatchEndElos(action.match);
    this.matchService.addMatch(updatedMatch).subscribe(() => {
      this.store.dispatch(new UpdatePlayersForMatchAction(updatedMatch));
      ctx.patchState({
        recentMatches: [...state.recentMatches, updatedMatch],
      });
    });
  }

  @Action(AddLiveMatchAction)
  addLiveMatch(ctx: StateContext<MatchStateModel>, action: AddLiveMatchAction) {
    const state = ctx.getState();
    const liveMatch = action.liveMatch;
    this.matchService.addLiveMatch(liveMatch).subscribe(() => {
      ctx.patchState({
        liveMatches: [...state.liveMatches, liveMatch],
      });
    });
  }

  @Action(FetchMachesForPlayerIdAction)
  fetchMachesForPlayerId(ctx: StateContext<MatchStateModel>, action: FetchMachesForPlayerIdAction) {
    const state = ctx.getState();
    this.matchService.getMatchesForId(action.id).subscribe((matches: Match[]) => {
      ctx.patchState({
        matchesByPlayerId: { ...state.matchesByPlayerId, [action.id]: matches },
      });
    });
  }

  @Action(WatchForNewMatchAction)
  watchForNewMatch(ctx: StateContext<MatchStateModel>) {
    this.matchService
      .watchForNewMatch()
      .pipe(
        filter((match) => {
          return !!match?.id;
        }),
      )
      .subscribe((newMatch) => ctx.patchState({ newMatch }));
  }

  private setMatchEndElos(match: Match): Match {
    if (match.winnerStartElo && match.loserStartElo) {
      const winnerRatio = Math.pow(10, match.winnerStartElo / 400);
      const loserRatio = Math.pow(10, match.loserStartElo / 400);
      const winnerModifier = 1 - winnerRatio / (loserRatio + winnerRatio);
      const loserModifier = 0 - loserRatio / (loserRatio + winnerRatio);
      const newWinnerElo = match.winnerStartElo + this.ELO_CONST * winnerModifier;
      const newLoserElo = match.loserStartElo + this.ELO_CONST * loserModifier;
      match.winnerEndElo = Math.round(newWinnerElo * 10) / 10;
      match.loserEndElo = Math.round(newLoserElo * 10) / 10;
    }
    return match;
  }
}
