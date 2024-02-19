import { Component, ComponentRef, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { combineLatest, filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { Match } from './shared/models/match';
import { AddMatchModalComponent } from './shared/modals/add-match-modal/add-match-modal/add-match-modal.component';
import { RegisterModalComponent } from './shared/modals/register-modal/register-modal.component';
import { AuthService } from './shared/data/auth/auth.service';
import { Player } from './shared/models/player';
import { MatchFacade } from './shared/data/match/match.facade';
import { PlayerFacade } from './shared/data/player/player.facade';
import { NewMatchAnimationComponent } from './shared/modals/new-match-animation/new-match-animation.component';
import { AuthModalComponent } from './shared/modals/auth-modal/auth-modal.component';
import { StartLiveMatchModalComponent } from './shared/modals/start-live-match-modal/add-match-modal/start-live-match-modal.component';
import { LiveMatch } from './shared/models/liveMatch';
import { faEye } from '@fortawesome/free-solid-svg-icons';

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
  startLiveMatchModal: ComponentRef<StartLiveMatchModalComponent>;
  registerModal: ComponentRef<RegisterModalComponent>;
  authModal: ComponentRef<AuthModalComponent>;
  profileDropdownOpen = false;
  appViewRef: ViewContainerRef;
  newMatchAnimation: ComponentRef<NewMatchAnimationComponent>;
  liveMatches$: Observable<LiveMatch[]>;
  faEye = faEye;

  constructor(
    private router: Router,
    private vcr: ViewContainerRef,
    private matchFacade: MatchFacade,
    private playerFacade: PlayerFacade,
    private authService: AuthService,
  ) {
    this.appViewRef = vcr;
    this.liveMatches$ = matchFacade.liveMatches$;
  }

  async ngOnInit() {
    this.authService.user$
      .pipe(
        tap((user) => {
          if (user) {
            this.closeAuthModal();
            this.matchFacade.fetchMatches();
            this.matchFacade.fetchLiveMatches();
            this.playerFacade.fetchPlayers();
          } else {
            this.displayAuthModal();
          }
        }),
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

  displayLiveMatchModal() {
    this.startLiveMatchModal = this.vcr.createComponent(StartLiveMatchModalComponent);
    this.startLiveMatchModal.instance.players$ = this.playerFacade.players$;
    this.startLiveMatchModal.instance.liveMatches$ = this.matchFacade.liveMatches$;
    this.startLiveMatchModal.instance.closeModal.subscribe((match?: LiveMatch) => {
      if (match) {
        this.matchFacade.addLiveMatch(match);
      }
      this.vcr.clear();
    });
  }

  displayRegisterModal() {
    this.profileDropdownOpen = false;
    this.registerModal = this.vcr.createComponent(RegisterModalComponent);
    this.registerModal.instance.closeModal.subscribe((player?: Player) => {
      if (player) {
        this.playerFacade.savePlayer(player);
      }
      this.vcr.clear();
    });
  }

  logout() {
    this.authService.logout();
  }

  displayAuthModal() {
    this.authModal = this.vcr.createComponent(AuthModalComponent);
    return this.authModal.instance.closeModal;
  }

  closeAuthModal() {
    this.authModal.destroy();
  }

  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  private startNewMatchAnimation(match: Match) {
    const winner$: Observable<Player> = this.playerFacade.getPlayerForId(match.winnerId);
    const loser$: Observable<Player> = this.playerFacade.getPlayerForId(match.loserId);
    combineLatest([winner$, loser$])
      .pipe(take(1))
      .subscribe((players) => {
        this.matchFacade.startNewMatchAnimation(match, players[0], players[1], this.appViewRef);
      });
  }
}
