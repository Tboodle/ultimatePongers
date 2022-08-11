import { Component, Input } from '@angular/core';
import { Player } from '../../models/player';

@Component({
  selector: 'player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.scss'],
})
export class PlayerProfileComponent {
  @Input() player: Player;
}
