import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'firebase/auth';
import { map, Observable, switchMap, tap } from 'rxjs';
import { Match } from '../shared/models/match';
import { Matchup } from '../shared/models/matchup';
import { Player } from '../shared/models/player';
import { AuthService } from '../shared/services/auth.service';
import { MatchService } from '../shared/services/match.service';
import { PlayerService } from '../shared/services/player.service';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.scss'],
})
export class StatsPageComponent implements OnInit {
  players$: Observable<any>;
  currentPlayer$: Observable<any>;
  matchups$: Observable<any>;
  matches$: Observable<any>;

  constructor(
    private authService: AuthService,
    private playerService: PlayerService,
    private matchService: MatchService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.players$ = this.playerService.getPlayers();
      this.currentPlayer$ = this.playerService.getPlayerForId(id).pipe(
        tap((player: Player) => {
          this.matches$ = this.matchService.getMatchesForId(id);
          this.matchups$ = this.matches$.pipe(
            map((matches) => this.getMatchupsFromMatches(player, matches)),
          );
        }),
      );
    }
  }

  private getMatchupsFromMatches(player: Player, matches: Match[]): Matchup[] {
    const matchupMap: Map<string, Matchup> = new Map();
    matches.forEach((match) => {
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
