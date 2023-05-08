import { Component, Input } from '@angular/core';
import { Tournament } from '../shared/models/tournament';

@Component({
  selector: 'app-tournament-page',
  templateUrl: './tournament-page.component.html',
  styleUrls: ['./tournament-page.component.scss'],
})
export class TournamentPageComponent {
  @Input() tournaments: Tournament[];
}
