import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { Player } from 'src/app/shared/models/player';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent {
  @Input() players: Player[];

  constructor() {}
  getWinPercentageForPlayer(player: Player): string {
    const totalMatches = player.wins + player.losses;

    if (totalMatches > 0) {
      return ((100 * player.wins) / totalMatches).toFixed(2) + '%';
    } else {
      return '-';
    }
  }
}
