import { Injectable } from '@angular/core';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  players = [{ id: 'p1', name: 'Tyler', nickName: 'Tboodle' }, { id: 'p2', name: 'Jim', nickName: 'Halfpint' }]

  constructor() { }

  public getPlayers(): Player[] {
    return this.players;
  }

  public getPlayerForId(id: string): Player | undefined {
    return this.players.find((player) => player.id === id);
  }
}
