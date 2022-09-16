import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { map, Observable } from 'rxjs';
import { Player } from '../../models/player';
import { FetchPlayersAction, UpdatePlayerAction } from './player.actions';
import { PlayerState } from './player.state';

@Injectable({
  providedIn: 'root',
})
export class PlayerFacade {
  constructor(private store: Store) {}

  @Select(PlayerState.getCurrentPlayer) currentPlayer$: Observable<Player>;

  @Select(PlayerState.getPlayers) players$: Observable<Player[]>;

  fetchPlayers(): Observable<any> {
    return this.store.dispatch(new FetchPlayersAction());
  }

  getPlayerForId(id: string): Observable<Player> {
    return this.store.select(PlayerState.getPlayerForId).pipe(map((filterFn) => filterFn(id)));
  }

  getPlayerForEmail(email: string): Observable<Player> {
    return this.store
      .select(PlayerState.getPlayerForEmail)
      .pipe(map((filterFn) => filterFn(email)));
  }

  savePlayer(player: Player) {
    this.store.dispatch(new UpdatePlayerAction(player));
  }
}
