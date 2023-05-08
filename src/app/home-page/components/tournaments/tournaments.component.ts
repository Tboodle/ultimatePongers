import { Component, Input, OnInit } from '@angular/core';
import { Tournament } from 'src/app/shared/models/tournament';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss'],
})
export class TournamentsComponent implements OnInit {
  @Input() tournaments: Tournament[];

  ngOnInit() {
    console.log(this.tournaments);
  }
}
