import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../../models/player';

@Component({
  selector: 'player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.scss'],
})
export class PlayerProfileComponent {
  @Input() player: Player;
  @Input() cardView: boolean = false;
  @Input() navigationEnabled = false;

  @Output() statNavigationEvent = new EventEmitter<string>();

  navigateToStatsPageForPlayer(player: Player) {
    this.statNavigationEvent.emit(player.id);
  }
}
