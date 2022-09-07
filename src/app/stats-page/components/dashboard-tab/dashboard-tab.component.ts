import { Component, Input } from '@angular/core';
import { Match } from 'src/app/shared/models/match';
import { Matchup } from 'src/app/shared/models/matchup';
import { Player } from 'src/app/shared/models/player';

@Component({
  selector: 'dashboard-tab',
  templateUrl: './dashboard-tab.component.html',
  styleUrls: ['./dashboard-tab.component.scss'],
})
export class DashboardTabComponent {
  @Input() currentPlayer: Player;
  @Input() players: Player[];
  @Input() matches: Match[];
  @Input() matchups: Matchup[];
}
