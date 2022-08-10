import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { map, switchMap } from 'rxjs';
import { Match } from './shared/models/match';
import { AddMatchModalComponent } from './shared/modals/add-match-modal/add-match-modal/add-match-modal.component';
import { RegisterModalComponent } from './shared/modals/register-modal/register-modal.component';
import { AuthService } from './shared/services/auth.service';
import { MatchService } from './shared/services/match.service';
import { PlayerService } from './shared/services/player.service';
import { Player } from './shared/models/player';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'BTI360 Ping Pong';
  currentUser: User;
  addMatchModal: ComponentRef<AddMatchModalComponent>;
  registerModal: ComponentRef<RegisterModalComponent>;
  profileDropdownOpen = false;

  constructor(
    private router: Router,
    private vcr: ViewContainerRef,
    private matchService: MatchService,
    private playerService: PlayerService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.authenitcateUser();
    this.authService.user$
      .pipe(
        switchMap((user: User) => {
          this.currentUser = user;
          return this.playerService.getPlayerForEmail(user.email || '');
        }),
        map((player: Player) => !!player)
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

  isCompetitorsPage() {
    return this.router.url.endsWith('/competitors');
  }

  displayAddMatchModal() {
    this.addMatchModal = this.vcr.createComponent(AddMatchModalComponent);
    this.addMatchModal.instance.closeModal.subscribe((match?: Match) => {
      if (match) {
        this.matchService.addMatch(match);
      }
      this.vcr.clear();
    });
  }

  displayRegisterModal() {
    this.profileDropdownOpen = false;
    this.registerModal = this.vcr.createComponent(RegisterModalComponent);
    this.registerModal.instance.closeModal.subscribe((player?: Player) => {
      if (player) {
        this.playerService.savePlayer(player);
      }
      this.vcr.clear();
    });
  }

  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }
}
