import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private router: Router) {}

  navigateToStatsPageForPlayer() {
    this.router.navigateByUrl(`/player/${this.player.id}`);
  }
}
