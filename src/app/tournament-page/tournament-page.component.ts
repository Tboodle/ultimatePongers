import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { PlayerFacade } from '../shared/data/player/player.facade';
import { TournamentFacade } from '../shared/data/tournament/tournament.facade';
import { Player } from '../shared/models/player';
import { Tournament } from '../shared/models/tournament';

@Component({
  selector: 'app-tournament-page',
  templateUrl: './tournament-page.component.html',
  styleUrls: ['./tournament-page.component.scss'],
  animations: [
    trigger('parent', [transition(':enter', [])]),
    trigger('contentSlide', [
      transition(':enter', [
        style({ transform: 'translateX(200%)' }),
        animate('500ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [animate('500ms ease-in', style({ transform: 'translateX(200%)' }))]),
    ]),
    trigger('listSlide', [
      transition(':enter', [
        style({ transform: 'translateX(-200%)' }),
        animate('500ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [animate('500ms ease-in', style({ transform: 'translateX(-200%)' }))]),
    ]),
  ],
})
export class TournamentPageComponent implements OnInit {
  tournaments$: Observable<Tournament[]>;
  currentPlayer: Player;
  activeTournament: Tournament;
  formView = false;
  faArrowLeft = faArrowLeft;

  constructor(
    private tournamentFacade: TournamentFacade,
    private playerFacade: PlayerFacade,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.tournaments$ = this.tournamentFacade.tournaments$;
    this.playerFacade.currentPlayer$.subscribe((currentPlayer) => {
      this.currentPlayer = currentPlayer;
    });
  }

  toggleForm(): void {
    this.formView = !this.formView;
  }

  createTournament(partialTournament: Tournament): void {
    const tournament: Tournament = {
      ...partialTournament,
      creatorId: this.currentPlayer?.id,
    };
    this.tournamentFacade.createTournament(tournament).subscribe(() => {
      this.formView = false;
    });
  }

  joinTournament(tournament: Tournament): void {
    this.tournamentFacade.addPlayerToTournament(tournament, this.currentPlayer.id).subscribe(() => {
      console.log('done');
    });
  }

  viewTournament(tournament: Tournament): void {
    this.activeTournament = tournament;
  }
}
