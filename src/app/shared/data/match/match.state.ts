import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { tap } from 'rxjs';
import { NewMatchAnimationComponent } from '../../modals/new-match-animation/new-match-animation.component';
import { Match } from '../../models/match';
import { UpdatePlayersForMatchAction } from '../player/player.actions';
import { AddMatchAction, FetchMachesForPlayerIdAction, FetchMatchesAction } from './match.actions';
import { MatchService } from './match.service';

export interface MatchStateModel {
  recentMatches: Match[];
  matchesByPlayerId: { [key: string]: any };
}

@State<MatchStateModel>({
  name: 'match',
  defaults: {
    recentMatches: [],
    matchesByPlayerId: {},
  },
})
@Injectable()
export class MatchState {
  ELO_CONST = 40;
  appViewRef: ViewContainerRef;
  newMatchAnimation: ComponentRef<NewMatchAnimationComponent>;

  constructor(private store: Store, private matchService: MatchService) {}

  @Selector()
  static getMatches(state: MatchStateModel) {
    return state.recentMatches;
  }

  @Selector()
  static getMatchesByPlayerId(state: MatchStateModel) {
    return state.matchesByPlayerId;
  }

  @Action(FetchMatchesAction)
  fetchMatches(ctx: StateContext<MatchStateModel>) {
    const state = ctx.getState();
    this.matchService
      .getMatches()
      .pipe(
        tap((matches: Match[]) => {
          if (matches.length === 1) {
            console.log('new match');
            const newMatch = matches[0];
            this.startNewMatchAnimation(newMatch);
          } else {
            // const newMatch = docEvents[0].payload.doc.data() as Match;
            // this.startNewMatchAnimation(newMatch);
          }
        }),
      )
      .subscribe((matches: Match[]) => {
        ctx.patchState({
          recentMatches: matches.concat(state.recentMatches),
        });
      });
  }

  @Action(AddMatchAction)
  addMatch(ctx: StateContext<MatchStateModel>, action: AddMatchAction) {
    const state = ctx.getState();
    const updatedMatch = this.setMatchEndElos(action.match);
    this.matchService.addMatch(updatedMatch).subscribe((response) => {
      console.log(response);
      this.store.dispatch(new UpdatePlayersForMatchAction(updatedMatch));
      ctx.patchState({
        recentMatches: [...state.recentMatches, updatedMatch],
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

  private startNewMatchAnimation(match: Match) {
    this.newMatchAnimation = this.appViewRef.createComponent(NewMatchAnimationComponent);
    this.newMatchAnimation.instance.match = match;
    this.newMatchAnimation.instance.closeModal.subscribe(() => this.appViewRef.clear());
  }
}
