import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Match } from '../../../models/match';
import { Player } from 'src/app/shared/models/player';
import { MatchFacade } from 'src/app/shared/data/match/match.facade';
import { PlayerFacade } from 'src/app/shared/data/player/player.facade';

@Component({
  selector: 'app-add-match-modal',
  templateUrl: './add-match-modal.component.html',
  styleUrls: ['./add-match-modal.component.scss'],
})
export class AddMatchModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<any>();

  players$: Observable<Player[]>;
  winner: Player;
  loser: Player;
  winnerScore = 21;
  loserScore: number;
  scoreError = false;

  constructor(private matchFacade: MatchFacade, private playerFacade: PlayerFacade) {}

  ngOnInit(): void {
    this.players$ = this.playerFacade.players$;
  }

  @HostListener('document:keydown.escape', ['$event'])
  exitModal() {
    this.closeModal.emit();
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

  isSubmittable(): boolean {
    return (
      this.winnerScore > this.loserScore &&
      this.winner &&
      this.loser &&
      this.winner.id !== this.loser.id
    );
  }

  addMatch() {
    if (this.isSubmittable()) {
      const match: Match = {
        id: uuidv4(),
        winnerId: this.winner?.id,
        winnerScore: this.winnerScore,
        winnerStartElo: this.winner.elo,
        loserId: this.loser?.id,
        loserScore: this.loserScore,
        loserStartElo: this.loser.elo,
        date: new Date(),
      };
      this.closeModal.emit(match);
    }
  }
}
