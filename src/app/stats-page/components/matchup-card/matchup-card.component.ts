import { Component, Input } from '@angular/core';
import { Matchup } from 'src/app/shared/models/matchup';
import { Player } from 'src/app/shared/models/player';

@Component({
  selector: 'matchup-card',
  templateUrl: './matchup-card.component.html',
  styleUrls: ['./matchup-card.component.scss'],
})
export class MatchupCardComponent {
  @Input() matchups: Matchup[];
  @Input() players: Player[];

  getOpponentForMatchup(matchup: Matchup) {
    return this.players.find((player) => player.id === matchup.player2Id);
  }

  calculateWinPercentage(matchup: Matchup) {
    return Math.round((matchup.player1Wins / (matchup.player1Wins + matchup.player2Wins)) * 100);
  }

  calculateLossPercentage(matchup: Matchup) {
    return Math.round((matchup.player2Wins / (matchup.player1Wins + matchup.player2Wins)) * 100);
  }
}
