import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatchFacade } from '../shared/data/match/match.facade';
import { PlayerFacade } from '../shared/data/player/player.facade';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  players$: Observable<any>;

  matches$: Observable<any>;

  constructor(private playerFacade: PlayerFacade, private matchFacade: MatchFacade) {}

  ngOnInit(): void {
    this.players$ = this.playerFacade.players$;
    this.matches$ = this.matchFacade.matches$;
  }
}
