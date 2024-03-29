import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { MatchFacade } from '../shared/data/match/match.facade';
import { PlayerFacade } from '../shared/data/player/player.facade';
import { Match } from '../shared/models/match';
import { Matchup } from '../shared/models/matchup';
import { Player } from '../shared/models/player';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.scss'],
})
export class StatsPageComponent implements OnInit, AfterContentChecked {
  fetchedId: string;
  players$: Observable<any>;
  currentPlayer$: Observable<any>;
  matchups$: Observable<any>;
  matches$: Observable<any>;
  dashboardIsActive = true;

  constructor(
    private playerFacade: PlayerFacade,
    private matchFacade: MatchFacade,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getPlayerInfoForNewRoute(id);
    }
  }

  ngAfterContentChecked(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && this.fetchedId !== id) {
      this.getPlayerInfoForNewRoute(id);
    }
  }

  fetchNewPlayer(player: Player) {
    this.navigateToStatsPageForPlayer(player.id);
  }

  setDashboardAsActive() {
    this.dashboardIsActive = true;
  }

  setMatchesAsActive() {
    this.dashboardIsActive = false;
  }

  navigateToStatsPageForPlayer(id: string) {
    this.router.navigateByUrl(`/player/${id}`);
  }

  private getPlayerInfoForNewRoute(id: string) {
    this.players$ = this.playerFacade.players$;
    this.fetchCurrentPlayerInfo(id);
    this.fetchedId = id;
  }

  private fetchCurrentPlayerInfo(id: string) {
    this.matchFacade.fetchMatchesForId(id);
    this.currentPlayer$ = this.playerFacade.getPlayerForId(id).pipe(
      tap((player: Player) => {
        this.matches$ = this.matchFacade.matchesByPlayerId$.pipe(
          map((matchesByPlayerId) => matchesByPlayerId[id]),
        );
        this.matchups$ = this.matches$.pipe(
          map((matches) => this.getMatchupsFromMatches(player, matches)),
        );
      }),
    );
  }

  private getMatchupsFromMatches(player: Player, matches: Match[]): Matchup[] {
    const matchupMap: Map<string, Matchup> = new Map();
    matches?.forEach((match) => {
      if (match.winnerId === player.id) {
        this.updateMatchupWithMatch(matchupMap, match, player, match.loserId);
      } else {
        this.updateMatchupWithMatch(matchupMap, match, player, match.winnerId);
      }
    });
    return ([...matchupMap.values()] as Matchup[]).sort(
      (matchup1: Matchup, matchup2: Matchup) =>
        matchup2.player1Wins + matchup2.player2Wins - matchup1.player1Wins - matchup1.player2Wins,
    );
  }

  private updateMatchupWithMatch(
    matchupMap: Map<string, Matchup>,
    match: Match,
    player: Player,
    opponentId: string,
  ) {
    const matchup = matchupMap.get(opponentId);
    if (matchup) {
      this.updateMatchupFieldsForMatch(matchup, match);
    } else {
      matchupMap.set(opponentId, this.generateMatchup(player.id, opponentId));
      const newMatchup = matchupMap.get(opponentId);
      this.updateMatchupFieldsForMatch(newMatchup as Matchup, match);
    }
  }

  private updateMatchupFieldsForMatch(matchup: Matchup, match: Match) {
    matchup.matches.concat(match);
    if (matchup.player1Id === match.winnerId) {
      matchup.player1Wins += 1;
      matchup.player2Points += match.loserScore as number;
      matchup.player1Points += match.winnerScore as number;
    } else {
      matchup.player2Wins += 1;
      matchup.player1Points += match.loserScore as number;
      matchup.player2Points += match.winnerScore as number;
    }
  }

  private generateMatchup(player1Id: string, player2Id: string): Matchup {
    return {
      matches: [],
      player1Id,
      player2Id,
      player1Wins: 0,
      player2Wins: 0,
      player1Points: 0,
      player2Points: 0,
    };
  }
}
