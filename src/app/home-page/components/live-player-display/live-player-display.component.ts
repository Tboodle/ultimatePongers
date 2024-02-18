import { Component, Input } from '@angular/core';
import { Player } from 'src/app/shared/models/player';

@Component({
  selector: 'live-player-display',
  templateUrl: './live-player-display.component.html',
  styleUrls: ['./live-player-display.component.scss'],
})
export class LivePlayerDisplayComponent {
  @Input() player: Player;
}
