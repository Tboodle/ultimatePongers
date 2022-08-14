import { Component, Input, OnInit } from '@angular/core';
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
  currentPlayer$: Observable<any>;
  matchups$: Observable<any>;
  matches$: Observable<any>;

  constructor(
    private authService: AuthService,
    private playerService: PlayerService,
    private matchService: MatchService,
  ) {}

  ngOnInit(): void {
    this.currentPlayer$ = this.authService.user$.pipe(
      switchMap((user: User) => {
        return this.playerService.getPlayerForEmail(user.email || '');
      }),
      tap((player: Player) => {
        this.matchups$ = this.matchService
          .getMatchesForPlayer(player)
          .pipe(map((matches) => this.getMatchupsFromMatches(player, matches)));
      }),
    );
  }

  private getMatchupsFromMatches(player: Player, matches: Match[]): Matchup[] {
    const opponents: Map<string, Matchup> = new Map();

    console.log(matches);

    matches.forEach((match) => {
      if (match.winnerId === player.id) {
        const matchup = opponents.get(match.loserId);
        if (matchup) {
          matchup.matches.concat(match);
          matchup.player1Wins += 1;
          matchup.player1Points += match.winnerScore;
          matchup.player2Points += match.loserScore;
        } else {
          opponents.set(match.loserId, this.generateMatchup(player.id, match.loserId));
        }
      } else {
        const matchup = opponents.get(match.winnerId);
        if (matchup) {
          matchup.matches.concat(match);
          matchup.player2Wins += 1;
          matchup.player1Points += match.loserScore;
          matchup.player2Points += match.winnerScore;
        } else {
          opponents.set(match.winnerId, this.generateMatchup(player.id, match.winnerId));
        }
      }
    });

    return [...opponents.values()];
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
