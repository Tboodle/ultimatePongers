import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Player } from '../../models/player';
import {
  FetchPlayersAction,
  SetCurrentPlayerAction,
  UpdatePlayerAction,
  UpdatePlayersForMatchAction,
} from './player.actions';
import { PlayerService } from './player.service';

export interface PlayerStateModel {
  currentPlayer?: Player;
  players: Player[];
}

@State<PlayerStateModel>({
  name: 'player',
  defaults: {
    currentPlayer: undefined,
    players: [],
  },
})
@Injectable()
export class PlayerState {
  constructor(private playerService: PlayerService) {}

  @Selector() static getPlayers(state: PlayerStateModel) {
    return state.players;
  }

  @Selector() static getCurrentPlayer(state: PlayerStateModel) {
    return state.currentPlayer;
  }

  @Selector() static getPlayerForId(state: PlayerStateModel): (id: string) => Player {
    return (id: string) => {
      return state.players.find((player) => player.id === id) as Player;
    };
  }

  @Selector() static getPlayerForEmail(state: PlayerStateModel): (email: string) => Player {
    return (email: string) => {
      return state.players.find((player) => player.email === email) as Player;
    };
  }

  @Action(FetchPlayersAction)
  fetchPlayers(ctx: StateContext<PlayerStateModel>) {
    this.playerService.getPlayers().subscribe((players: Player[]) => {
      ctx.patchState({
        players,
      });
    });
  }

  @Action(SetCurrentPlayerAction)
  setCurrentPlayer(ctx: StateContext<PlayerStateModel>, action: SetCurrentPlayerAction) {
    const state = ctx.getState();
    const currentPlayer = state.players.find((player) => player.email === action.email);
    ctx.patchState({
      currentPlayer,
    });
  }

  @Action(UpdatePlayerAction)
  savePlayer(ctx: StateContext<PlayerStateModel>, action: UpdatePlayerAction) {
    const state = ctx.getState();
    const playerExists = !!state.players.find((player) => player.id === action.player.id);
    if (playerExists) {
      this.playerService.savePlayer(action.player);
    } else {
      this.playerService.createPlayer(action.player);
    }
  }

  @Action(UpdatePlayersForMatchAction)
  updatePlayersForMatch(ctx: StateContext<PlayerStateModel>, action: UpdatePlayersForMatchAction) {
    const state = ctx.getState();
    this.playerService.updatePlayersForMatch(state.players, action.match).subscribe();
  }
}
