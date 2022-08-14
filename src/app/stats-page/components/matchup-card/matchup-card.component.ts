import { Component, Input, OnChanges } from '@angular/core';
import { Matchup } from 'src/app/shared/models/matchup';

@Component({
  selector: 'matchup-card',
  templateUrl: './matchup-card.component.html',
  styleUrls: ['./matchup-card.component.scss'],
})
export class MatchupCardComponent implements OnChanges {
  @Input() matchups: Matchup[];

  ngOnChanges(): void {
    console.log(this.matchups);
  }
}
