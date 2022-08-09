import {Component, Input, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import {MatchService} from '../shared/services/match.service';
import {PlayerService} from '../shared/services/player.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  players$: Observable<any>;
  matches$: Observable<any>;

  constructor(private playerService: PlayerService, private matchService: MatchService) { }

  ngOnInit(): void {
    this.players$ = this.playerService.getPlayers();
    this.matches$ = this.matchService.getMatches();
  }
}
