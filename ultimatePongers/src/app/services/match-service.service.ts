import { Injectable } from '@angular/core';
import { Match } from '../models/match';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  players = ['p1', 'p2'];
  matches = [{ id: 'g1', loserId: this.players[1], winnerId: this.players[0], winnerScore: 21, loserScore: 0, date: Date.now() }, { id: 'g2', loserId: this.players[0], winnerId: this.players[1], winnerScore: 21, loserScore: 0, date: Date.now() }];

  constructor() { }

  public getMatches(): Match[] {
    return this.matches;
  }

  public getMatchesForPlayerId(id: string): Match[] {
    return this.matches.filter((match) => match.loserId === id || match.winnerId === id);
  }
}
