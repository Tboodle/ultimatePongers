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
import { Match } from '../../../shared/match';
import { Player } from '../../../shared/player';
import { AddMatchModalComponent } from './shared/modals/add-match-modal/add-match-modal/add-match-modal.component';
import { RegisterModalComponent } from './shared/modals/register-modal/register-modal.component';
import { AuthService } from './shared/services/auth.service';
import { MatchService } from './shared/services/match.service';
import { PlayerService } from './shared/services/player.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ultimatePongers';
  addMatchModal: ComponentRef<AddMatchModalComponent>;
  registerModal: ComponentRef<RegisterModalComponent>;

  constructor(
    private router: Router,
    private vcr: ViewContainerRef,
    private matchService: MatchService,
    private playerService: PlayerService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.authenitcateUser();
    this.authService.user$
      .pipe(
        switchMap((user: User) =>
          this.playerService.emailNotRegistered(user.email || '')
        ),
        map((isNewUser: boolean) => {
          if (isNewUser) {
            this.displayRegisterModal();
          }
        })
      )
      .subscribe();
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
    this.registerModal = this.vcr.createComponent(RegisterModalComponent);
    this.registerModal.instance.closeModal.subscribe((player?: Player) => {
      if (player) {
        this.registerPlayer(player);
      }
      this.vcr.clear();
    });
  }

  registerPlayer(player: Player) {
    this.playerService.registerPlayer(player);
  }
}
