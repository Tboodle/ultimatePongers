import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from 'src/app/shared/models/player';
import { MatchFacade } from 'src/app/shared/data/match/match.facade';
import { PlayerFacade } from 'src/app/shared/data/player/player.facade';

@Component({
  selector: 'start-live-match-modal',
  templateUrl: './start-live-match-modal.component.html',
  styleUrls: ['./start-live-match-modal.component.scss'],
})
export class StartLiveMatchModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<any>();
  @Input() isLiveMatch = false;

  players$: Observable<Player[]>;
  player1: Player;
  player2: Player;

  constructor(
    private matchFacade: MatchFacade,
    private playerFacade: PlayerFacade,
  ) {}

  ngOnInit(): void {
    this.players$ = this.playerFacade.players$;
  }

  @HostListener('document:keydown.escape', ['$event'])
  exitModal() {
    this.closeModal.emit();
  }

  setPlayer1(player1: any) {
    this.player1 = player1;
  }

  setPlayer2(player2: any) {
    this.player2 = player2;
  }

  isStartable(): boolean {
    return !!this.player1 && !!this.player2;
  }

  startLiveMatch() {
    if (this.isStartable()) {
      return;
    }
  }
}
