import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Match } from 'src/app/shared/models/match';
import { Player } from 'src/app/shared/models/player';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'match-history-header',
  templateUrl: './match-history-header.component.html',
  styleUrls: ['./match-history-header.component.scss'],
})
export class MatchHistoryHeaderComponent implements OnInit, OnChanges {
  @Input() currentPlayer: Player;
  @Input() players: Player[];
  @Input() matches: Match[];

  @Output() opponentSelected: EventEmitter<Player> = new EventEmitter();

  faArrowTrendUp = faArrowTrendUp;
  faArrowTrendDown = faArrowTrendDown;
  opponent: Player;
  wins = 0;
  losses = 0;
  pointsFor = 0;
  pointsAgainst = 0;
  highestElo = 0;
  lowestElo = 999999;
  eloDiff = 0;
  allPlayerOption: Player = {
    id: '-1',
    email: '',
    name: 'All Players',
    wins: 0,
    losses: 0,
    elo: 0,
  };

  ngOnInit(): void {
    this.opponent = this.allPlayerOption;
    this.players.splice(0, 0, this.allPlayerOption);
    this.setStatsForMatches();
  }

  ngOnChanges(): void {
    this.players = this.players.filter((player) => player.id !== this.currentPlayer.id);
    this.resetStats();
    this.setStatsForMatches();
  }

  private setStatsForMatches() {
    const filteredMatches =
      this.opponent !== this.allPlayerOption
        ? this.matches.filter(
            (match: Match) =>
              match.winnerId === this.opponent?.id || match.loserId === this.opponent?.id,
          )
        : this.matches;
    filteredMatches.forEach((match) => {
      this.setStatsForMatch(match);
    });
  }

  setOpponent(player: Player) {
    this.opponentSelected.emit(player);
    this.opponent = player;
  }

  private resetStats() {
    this.wins = 0;
    this.losses = 0;
    this.pointsFor = 0;
    this.pointsAgainst = 0;
    this.highestElo = 0;
    this.lowestElo = 999999;
    this.eloDiff = 0;
  }

  private setStatsForMatch(match: Match) {
    if (this.currentPlayer.id === match.winnerId) {
      this.setStatsForWin(match);
    } else {
      this.setStatsForLoss(match);
    }
  }

  private setStatsForLoss(match: Match) {
    this.losses++;
    this.pointsFor += Number(match.loserScore);
    this.pointsAgainst += Number(match.winnerScore);
    if (match.loserEndElo && match.loserStartElo) {
      this.eloDiff += match.loserEndElo - match.loserStartElo;
      this.highestElo = match.loserEndElo > this.highestElo ? match.loserEndElo : this.highestElo;
      this.lowestElo = match.loserEndElo < this.lowestElo ? match.loserEndElo : this.lowestElo;
    }
  }

  private setStatsForWin(match: Match) {
    this.wins++;
    this.pointsFor += Number(match.winnerScore);
    this.pointsAgainst += Number(match.loserScore);
    if (match.winnerEndElo && match.winnerStartElo) {
      this.eloDiff += match.winnerEndElo - match.winnerStartElo;
      this.highestElo = match.winnerEndElo > this.highestElo ? match.winnerEndElo : this.highestElo;
      this.lowestElo = match.winnerEndElo < this.lowestElo ? match.winnerEndElo : this.lowestElo;
    }
  }
}
