import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faArrowRightRotate, faClose } from '@fortawesome/free-solid-svg-icons';
import { MatchFacade } from 'src/app/shared/data/match/match.facade';
import { PlayerFacade } from 'src/app/shared/data/player/player.facade';
import { LiveMatch } from 'src/app/shared/models/liveMatch';
import { Match } from 'src/app/shared/models/match';
import { Player } from 'src/app/shared/models/player';

@Component({
  selector: 'app-recent-matches',
  templateUrl: './recent-matches.component.html',
  styleUrls: ['./recent-matches.component.scss'],
})
export class RecentMatchesComponent implements OnInit {
  @Input() matches: Match[];
  @Input() liveMatches: LiveMatch[];
  @Input() players: Player[];
  @Input() currentPlayer: Player;
  @Output() playAnimationForMatchEmitter = new EventEmitter<Match>();

  constructor(private matchFacade: MatchFacade) {}

  ngOnInit(): void {
    console.log(this.liveMatches);
  }

  faArrowRightRotate = faArrowRightRotate;
  faClose = faClose;

  playerIsActive(): boolean {
    return this.liveMatches
      .flatMap((liveMatch) => [liveMatch.player1, liveMatch.player2])
      .includes(this.currentPlayer.id);
  }

  cancelUserMatch(): void {
    const matchId = this.liveMatches.find(
      (match) => match.player1 === this.currentPlayer.id || match.player2 === this.currentPlayer.id,
    ).id;

    if (matchId) {
      this.matchFacade.cancelLiveMatch(
        this.liveMatches.find(
          (match) =>
            match.player1 === this.currentPlayer.id || match.player2 === this.currentPlayer.id,
        ).id,
      );
    }
  }

  getPlayer(id: string): Player {
    return this.players?.find((player) => player.id === id)!;
  }

  getLeftPlayer(match: Match): Player {
    if (match?.winnerStartElo && match?.loserStartElo) {
      return match.winnerStartElo >= match.loserStartElo
        ? this.getPlayer(match.winnerId)
        : this.getPlayer(match.loserId);
    }
    return this.getPlayer(match.winnerId);
  }

  getLeftPlayerForLiveMatch(liveMatch: LiveMatch): Player {
    const player1 = this.getPlayer(liveMatch.player1);
    const player2 = this.getPlayer(liveMatch.player2);

    return player1.elo > player2.elo ? player1 : player2;
  }

  getRightPlayerForLiveMatch(liveMatch: LiveMatch): Player {
    const player1 = this.getPlayer(liveMatch.player1);
    const player2 = this.getPlayer(liveMatch.player2);

    return player1.elo > player2.elo ? player2 : player1;
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
      return match.winnerStartElo >= match.loserStartElo ? match.winnerScore : match.loserScore;
    }
    return match.winnerScore;
  }

  getRightScore(match: Match): number {
    if (match?.winnerStartElo && match?.loserStartElo) {
      return match.winnerStartElo < match.loserStartElo ? match.winnerScore : match.loserScore;
    }
    return match.loserScore;
  }

  replayAnimationForMatch(match: Match): void {
    this.playAnimationForMatchEmitter.emit(match);
  }

  routeToWatch(): void {
    window.location.href = 'http://192.168.1.25:8082';
  }
}
