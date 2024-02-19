import { Component, Input } from '@angular/core';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { Player } from 'src/app/shared/models/player';

@Component({
  selector: 'live-player-display',
  templateUrl: './live-player-display.component.html',
  styleUrls: ['./live-player-display.component.scss'],
})
export class LivePlayerDisplayComponent {
  @Input() player: Player;
  faCrown = faCrown;
}
