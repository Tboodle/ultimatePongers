import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Tournament } from '../../models/tournament';
import {
  FetchTournamentsAction,
  CreateTournamentAction,
  AddPlayerToTournamentAction,
} from './tournament.actions';
import { TournamentState } from './tournament.state';

@Injectable({
  providedIn: 'root',
})
export class TournamentFacade {
  constructor(private store: Store) {}

  @Select(TournamentState.getTournaments) tournaments$: Observable<Tournament[]>;

  fetchTournaments(): Observable<any> {
    return this.store.dispatch(new FetchTournamentsAction());
  }

  createTournament(tournament: Tournament): Observable<any> {
    return this.store.dispatch(new CreateTournamentAction(tournament));
  }

  addPlayerToTournament(tournament: Tournament, playerId: string) {
    return this.store.dispatch(new AddPlayerToTournamentAction(tournament, playerId));
  }
}
