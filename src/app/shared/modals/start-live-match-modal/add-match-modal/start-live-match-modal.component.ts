import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Player } from 'src/app/shared/models/player';
import { PlayerFacade } from 'src/app/shared/data/player/player.facade';
import { LiveMatch } from 'src/app/shared/models/liveMatch';

@Component({
  selector: 'start-live-match-modal',
  templateUrl: './start-live-match-modal.component.html',
  styleUrls: ['./start-live-match-modal.component.scss'],
})
export class StartLiveMatchModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<LiveMatch | null>();
  isLiveMatch = false;

  players$: Observable<Player[]>;
  player1: Player;
  player2: Player;

  constructor(private playerFacade: PlayerFacade) {}

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
    this.closeModal.emit({
      id: uuidv4(),
      player1: this.player1.id,
      player2: this.player2.id,
      date: new Date(),
    });
  }
}
