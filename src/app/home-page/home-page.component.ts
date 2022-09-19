import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { combineLatest, Observable, take } from 'rxjs';
import { MatchFacade } from '../shared/data/match/match.facade';
import { PlayerFacade } from '../shared/data/player/player.facade';
import { Match } from '../shared/models/match';
import { Player } from '../shared/models/player';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  players$: Observable<any>;
  matches$: Observable<any>;
  viewRef: ViewContainerRef;

  constructor(
    private playerFacade: PlayerFacade,
    private matchFacade: MatchFacade,
    private vcr: ViewContainerRef,
  ) {
    this.viewRef = vcr;
  }

  ngOnInit(): void {
    this.players$ = this.playerFacade.players$;
    this.matches$ = this.matchFacade.matches$;
  }

  startNewMatchAnimation(match: Match) {
    const winner$: Observable<Player> = this.playerFacade.getPlayerForId(match.winnerId);
    const loser$: Observable<Player> = this.playerFacade.getPlayerForId(match.loserId);
    combineLatest([winner$, loser$])
      .pipe(take(1))
      .subscribe((players) => {
        this.matchFacade.startNewMatchAnimation(match, players[0], players[1], this.viewRef);
      });
  }
}
