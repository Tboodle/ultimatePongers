import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Match } from '../../models/match';
import { Player } from '../../models/player';

@Component({
  selector: 'app-new-match-animation',
  templateUrl: './new-match-animation.component.html',
  styleUrls: ['./new-match-animation.component.scss'],
})
export class NewMatchAnimationComponent implements OnInit {
  match: Match;
  winner: Player;
  loser: Player;

  @Output() closeModal = new EventEmitter<Player>();

  ngOnInit(): void {
    setTimeout(() => this.closeModal.emit(), 2000);
  }
}
