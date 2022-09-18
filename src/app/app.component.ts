import { Component, ComponentRef, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { combineLatest, filter, forkJoin, map, Observable, switchMap, take, tap } from 'rxjs';
import { Match } from './shared/models/match';
import { AddMatchModalComponent } from './shared/modals/add-match-modal/add-match-modal/add-match-modal.component';
import { RegisterModalComponent } from './shared/modals/register-modal/register-modal.component';
import { AuthService } from './shared/data/auth/auth.service';
import { Player } from './shared/models/player';
import { MatchFacade } from './shared/data/match/match.facade';
import { PlayerFacade } from './shared/data/player/player.facade';
import { NewMatchAnimationComponent } from './shared/modals/new-match-animation/new-match-animation.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'BTI360 Ping Pong';
  playerId: string;
  currentUser: User;
  addMatchModal: ComponentRef<AddMatchModalComponent>;
  registerModal: ComponentRef<RegisterModalComponent>;
  profileDropdownOpen = false;
  appViewRef: ViewContainerRef;
  newMatchAnimation: ComponentRef<NewMatchAnimationComponent>;

  constructor(
    private router: Router,
    private vcr: ViewContainerRef,
    private matchFacade: MatchFacade,
    private playerFacade: PlayerFacade,
    private authService: AuthService,
  ) {
    this.appViewRef = vcr;
  }

  ngOnInit() {
    this.authService.authenitcateUser();
    this.matchFacade.fetchMatches();
    this.playerFacade.fetchPlayers();
    this.authService.user$
      .pipe(
        filter((user) => !!user),
        tap((user: User) => {
          this.currentUser = user;
        }),
        switchMap(() => this.playerFacade.players$),
        filter((players) => players?.length > 0),
        switchMap(() => {
          return this.playerFacade.getPlayerForEmail(this.currentUser.email || '');
        }),
        map((player: Player) => {
          this.playerId = player?.id;
          // this.playerFacade.setCurrentPlayer(player);
          return !!player;
        }),
      )
      .subscribe((isExistingUser: boolean) => {
        if (!isExistingUser) {
          this.displayRegisterModal();
        }
      });
    this.matchFacade.newMatch$.subscribe((newMatch: Match) => {
      if (newMatch) {
        this.startNewMatchAnimation(newMatch);
      }
    });
  }

  isHomePage() {
    return this.router.url.endsWith('/');
  }

  isStatsPage() {
    return this.router.url.includes('/player/');
  }

  displayAddMatchModal() {
    this.addMatchModal = this.vcr.createComponent(AddMatchModalComponent);
    this.addMatchModal.instance.closeModal.subscribe((match?: Match) => {
      if (match) {
        this.matchFacade.addMatch(match);
      }
      this.vcr.clear();
    });
  }

  displayRegisterModal() {
    this.profileDropdownOpen = false;
    this.registerModal = this.vcr.createComponent(RegisterModalComponent);
    this.registerModal.instance.closeModal.subscribe((player?: Player) => {
      if (player) {
        console.log(player);
        this.playerFacade.savePlayer(player);
      }
      this.vcr.clear();
    });
  }

  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  private startNewMatchAnimation(match: Match) {
    const winner$: Observable<Player> = this.playerFacade
      .getPlayerForId(match.winnerId)
      .pipe(tap((a) => console.log(a)));
    const loser$: Observable<Player> = this.playerFacade
      .getPlayerForId(match.loserId)
      .pipe(tap((a) => console.log(a)));
    combineLatest([winner$, loser$])
      .pipe(take(1))
      .subscribe((players) => {
        this.newMatchAnimation = this.appViewRef.createComponent(NewMatchAnimationComponent);
        this.newMatchAnimation.instance.match = match;
        this.newMatchAnimation.instance.winner = players[0];
        this.newMatchAnimation.instance.loser = players[1];
        this.newMatchAnimation.instance.closeModal.subscribe(() => this.appViewRef.clear());
      });
  }
}
