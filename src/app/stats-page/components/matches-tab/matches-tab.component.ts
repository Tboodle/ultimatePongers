import { Component, Input } from '@angular/core';
import { Match } from 'src/app/shared/models/match';
import { Matchup } from 'src/app/shared/models/matchup';
import { Player } from 'src/app/shared/models/player';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'matches-tab',
  templateUrl: './matches-tab.component.html',
  styleUrls: ['./matches-tab.component.scss'],
})
export class MatchesTabComponent {
  @Input() currentPlayer: Player;
  @Input() players: Player[];
  @Input() matches: Match[];
  @Input() matchups: Matchup[];

  faArrowTrendUp = faArrowTrendUp;
  faArrowTrendDown = faArrowTrendDown;

  getOpponentForMatch(match: Match): Player {
    return this.getPlayerForId(this.currentPlayer.id ? match.loserId : match.winnerId);
  }

  getPlayerForId(id: string): Player {
    return this.players?.find((player) => player.id === id)!;
  }
}
