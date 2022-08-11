import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatchService } from 'src/app/shared/services/match.service';
import { PlayerService } from 'src/app/shared/services/player.service';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Match } from '../../../models/match';
import { Player } from 'src/app/shared/models/player';

@Component({
  selector: 'app-add-match-modal',
  templateUrl: './add-match-modal.component.html',
  styleUrls: ['./add-match-modal.component.scss'],
})
export class AddMatchModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<any>();

  players$: Observable<any>;

  winner: Player;

  loser: Player;

  winnerScore: number;

  loserScore: number;

  constructor(private matchService: MatchService, private playerService: PlayerService) {}

  ngOnInit(): void {
    this.players$ = this.playerService.getPlayers();
  }

  setWinner(winner: any) {
    this.winner = winner;
  }

  setLoser(loser: any) {
    this.loser = loser;
  }

  updateWinnerScore(score: any) {
    this.winnerScore = score;
  }

  updateLoserScore(score: any) {
    this.loserScore = score;
  }

  addMatch() {
    const match: Match = {
      id: uuidv4(),
      winnerId: this.winner?.id,
      winnerScore: this.winnerScore,
      loserId: this.loser?.id,
      loserScore: this.loserScore,
      date: new Date(),
    };
    this.closeModal.emit(match);
  }
}
