import { Component, ComponentRef, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { filter, map, switchMap, tap } from 'rxjs';
import { Match } from './shared/models/match';
import { AddMatchModalComponent } from './shared/modals/add-match-modal/add-match-modal/add-match-modal.component';
import { RegisterModalComponent } from './shared/modals/register-modal/register-modal.component';
import { AuthService } from './shared/data/auth/auth.service';
import { Player } from './shared/models/player';
import { MatchFacade } from './shared/data/match/match.facade';
import { PlayerFacade } from './shared/data/player/player.facade';
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

  constructor(
    private router: Router,
    private vcr: ViewContainerRef,
    private matchFacade: MatchFacade,
    private playerFacade: PlayerFacade,
    private authService: AuthService,
  ) {
    this.matchFacade.appViewRef = vcr;
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
          return !!player;
        }),
      )
      .subscribe((isExistingUser: boolean) => {
        if (!isExistingUser) {
          this.displayRegisterModal();
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
        this.playerFacade.savePlayer(player);
      }
      this.vcr.clear();
    });
  }

  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }
}
