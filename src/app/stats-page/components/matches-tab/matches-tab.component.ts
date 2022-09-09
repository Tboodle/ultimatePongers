import { Component, Input } from '@angular/core';
import { Match } from 'src/app/shared/models/match';
import { Matchup } from 'src/app/shared/models/matchup';
import { Player } from 'src/app/shared/models/player';

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

  filteredMatches: Match[];

  getOpponentForMatch(match: Match): Player {
    return this.getPlayerForId(
      this.currentPlayer.id === match.winnerId ? match.loserId : match.winnerId,
    );
  }

  opponentSelected(opponent: Player) {
    this.filteredMatches = this.matches.filter(
      (match) => match.winnerId === opponent.id || match.loserId === opponent.id,
    );
  }

  private getPlayerForId(id: string): Player {
    return this.players?.find((player) => player.id === id)!;
  }
}
