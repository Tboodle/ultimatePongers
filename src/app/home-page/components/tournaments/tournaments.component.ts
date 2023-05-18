import { Component, Input, OnInit } from '@angular/core';
import { Tournament } from 'src/app/shared/models/tournament';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss'],
})
export class TournamentsComponent {
  @Input() tournaments: Tournament[];
  faPlus = faPlus;
}
