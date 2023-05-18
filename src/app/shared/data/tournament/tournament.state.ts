import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Tournament } from '../../models/tournament';
import { FetchTournamentsAction } from './tournament.actions';
import { TournamentService } from './tournament.service';

export interface TournamentStateModel {
  tournaments: Tournament[];
}

@State<TournamentStateModel>({
  name: 'tournament',
  defaults: {
    tournaments: [],
  },
})
@Injectable()
export class TournamentState {
  constructor(private tournamentsService: TournamentService) {}

  @Selector() static getTournaments(state: TournamentStateModel) {
    return state.tournaments;
  }

  @Action(FetchTournamentsAction)
  fetchTournaments(ctx: StateContext<TournamentStateModel>) {
    return this.tournamentsService.getTournaments().subscribe((tournaments: Tournament[]) => {
      ctx.patchState({
        tournaments,
      });
    });
  }
}
