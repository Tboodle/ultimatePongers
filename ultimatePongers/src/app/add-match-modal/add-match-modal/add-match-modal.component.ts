import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Player } from 'src/app/models/player';
import { MatchService } from 'src/app/services/match-service.service';
import { PlayerService } from 'src/app/services/player-service.service';

@Component({
  selector: 'app-add-match-modal',
  templateUrl: './add-match-modal.component.html',
  styleUrls: ['./add-match-modal.component.scss']
})
export class AddMatchModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<any>();

  players: Player[] = [];
  winner: Player;
  loser: Player;
  winnerScore: number;
  loserScore: number;

  constructor(private matchService: MatchService, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.players = this.playerService.getPlayers();
  }

  setWinner(event: any) {
    this.winner = event;
  }

  setLoser(event: any) {
    this.loser = event;
  }

  updateWinnerScore(score: any) {
    this.winnerScore = score;
  }

  updateLoserScore(score: any) {
    this.loserScore = score;
  }
}
