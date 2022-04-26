import { Injectable } from '@angular/core';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  players = [{ id: 'p1', name: 'Tyler', nickName: 'Tboodle', wins: 13, losses: 1 },
  { id: 'p2', name: 'Jim', nickName: 'Halfpint', wins: 1, losses: 1 },
  { id: 'p3', name: 'Kyle', nickName: 'NotSure', wins: 0, losses: 2 },
  { id: 'p2', name: 'Drew', nickName: 'OldMan', wins: 0, losses: 10 }];

  constructor() { }

  public getPlayers(): Player[] {
    return this.players;
  }

  public getPlayerForId(id: string): Player | undefined {
    return this.players.find((player) => player.id === id);
  }
}
