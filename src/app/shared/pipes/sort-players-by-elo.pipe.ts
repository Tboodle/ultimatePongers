import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Player } from '../models/player';

@Pipe({ name: 'sortPlayersByElo' })
export class SortPlayersByEloPipe implements PipeTransform {
  transform(players$: Observable<Player[]>): Observable<Player[]> {
    return players$.pipe(
      map((players: Player[]) =>
        players
          .filter((player: Player) => player.wins + player.losses > 0)
          .sort((player1, player2) => player2.elo - player1.elo),
      ),
    );
  }
}
