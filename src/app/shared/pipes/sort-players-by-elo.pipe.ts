import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../models/player';

@Pipe({ name: 'sortPlayersByElo' })
export class SortPlayersByEloPipe implements PipeTransform {
  transform(players: Player[]): Player[] {
    return players
      .filter((player) => player.wins + player.losses > 0)
      .sort((player1, player2) => player2.elo - player1.elo);
  }
}
