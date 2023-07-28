import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from 'src/app/shared/models/player';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent {
  @Input() players: Player[];
  @Output() statNavigationEvent = new EventEmitter<string>();
  currentPage: number = 1;
  pageSize: number = 10;

  getWinPercentageForPlayer(player: Player): string {
    const totalMatches = player.wins + player.losses;

    if (totalMatches > 0) {
      return ((100 * player.wins) / totalMatches).toFixed(1) + '%';
    } else {
      return '-';
    }
  }

  goToPage(pageNumber: number): void {
    const maxPage = this.players.length / this.pageSize - 1;
    this.currentPage = pageNumber < 1 ? 1 : pageNumber > maxPage ? maxPage : pageNumber;
  }

  filterPlayersForPage(players: Player[]): Player[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return players.slice(start, start + this.pageSize);
  }
}
