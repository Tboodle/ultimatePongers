import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Player } from 'src/app/shared/models/player';
import { PlayerFacade } from 'src/app/shared/data/player/player.facade';
import { LiveMatch } from 'src/app/shared/models/liveMatch';

@Component({
  selector: 'start-live-match-modal',
  templateUrl: './start-live-match-modal.component.html',
  styleUrls: ['./start-live-match-modal.component.scss'],
})
export class StartLiveMatchModalComponent implements OnInit, OnDestroy {
  @Output() closeModal = new EventEmitter<LiveMatch | null>();

  players$: Observable<Player[]>;
  liveMatches$: Observable<LiveMatch[]>;
  liveMatches: LiveMatch[];
  player1: Player;
  player2: Player;
  subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.liveMatches$.subscribe((liveMatches) => {
      this.liveMatches = liveMatches;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    return !this.playerAlreadyPlaying(this.player1) && !this.playerAlreadyPlaying(this.player2);
  }

  playerAlreadyPlaying(player: Player): boolean {
    return (
      !!player &&
      this.liveMatches
        .flatMap((liveMatch) => [liveMatch.player1, liveMatch.player2])
        .includes(player?.id || null)
    );
  }

  getErrorMessageForPlayer(player: Player): string {
    return this.playerAlreadyPlaying(player) ? `${player.name} is already playing` : '';
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
