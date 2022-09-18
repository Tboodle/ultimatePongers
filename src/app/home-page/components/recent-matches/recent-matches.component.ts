import { Component, Input } from '@angular/core';
import { Match } from 'src/app/shared/models/match';
import { Player } from 'src/app/shared/models/player';

@Component({
  selector: 'app-recent-matches',
  templateUrl: './recent-matches.component.html',
  styleUrls: ['./recent-matches.component.scss'],
})
export class RecentMatchesComponent {
  @Input() matches: Match[];

  @Input() players: Player[];

  getPlayer(id: string): Player {
    return this.players?.find((player) => player.id === id)!;
  }

  getLeftPlayer(match: Match): Player {
    if (match?.winnerStartElo && match?.loserStartElo) {
      return match.winnerStartElo > match.loserStartElo
        ? this.getPlayer(match.winnerId)
        : this.getPlayer(match.loserId);
    }
    return this.getPlayer(match.winnerId);
  }

  getRightPlayer(match: Match): Player {
    if (match?.winnerStartElo && match?.loserStartElo) {
      return match.winnerStartElo < match.loserStartElo
        ? this.getPlayer(match.winnerId)
        : this.getPlayer(match.loserId);
    }
    return this.getPlayer(match.loserId);
  }

  getLeftScore(match: Match): number {
    if (match?.winnerStartElo && match?.loserStartElo) {
      return match.winnerStartElo > match.loserStartElo ? match.winnerScore : match.loserScore;
    }
    return match.winnerScore;
  }

  getRightScore(match: Match): number {
    if (match?.winnerStartElo && match?.loserStartElo) {
      return match.winnerStartElo < match.loserStartElo ? match.winnerScore : match.loserScore;
    }
    return match.loserScore;
  }
}
