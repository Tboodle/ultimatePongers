import { Component, Input } from '@angular/core';
import { Match } from 'src/app/shared/models/match';
import { Player } from 'src/app/shared/models/player';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'match-card',
  templateUrl: './match-card.component.html',
  styleUrls: ['./match-card.component.scss'],
})
export class MatchCardComponent {
  @Input() match: Match;
  @Input() currentPlayer: Player;
  @Input() opponent: Player;

  faArrowTrendUp = faArrowTrendUp;
  faArrowTrendDown = faArrowTrendDown;
}
