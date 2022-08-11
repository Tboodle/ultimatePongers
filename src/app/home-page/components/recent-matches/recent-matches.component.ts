import { Component, Input } from '@angular/core';
import { Match } from 'src/app/shared/models/match';
import { Player } from 'src/app/shared/models/player';

@Component({
  selector: 'app-recent-matches',
  templateUrl: './recent-matches.component.html',
  styleUrls: ['./recent-matches.component.scss'],
})
export class RecentMatchesComponent {
  @Input() matches: Match[];

  @Input() players: Player[];

  getPlayer(id: string): Player {
    return this.players?.find((player) => player.id === id)!;
  }
}
