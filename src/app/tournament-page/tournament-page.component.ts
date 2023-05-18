import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { TournamentFacade } from '../shared/data/tournament/tournament.facade';
import { Tournament } from '../shared/models/tournament';
import { TournamentFormat } from '../shared/models/tournamentFormat';

@Component({
  selector: 'app-tournament-page',
  templateUrl: './tournament-page.component.html',
  styleUrls: ['./tournament-page.component.scss'],
  animations: [
    trigger('parent', [transition(':enter', [])]),
    trigger('formSlide', [
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
  formView = true;
  nameControl = new FormControl('');
  dateControl = new FormControl(new Date().toISOString().slice(0, 10));
  seededControl = new FormControl(false);
  formatControl = new FormControl('Single Elimination');
  formats = Object.values(TournamentFormat);
  formatDropdownOpen = false;
  faArrowLeft = faArrowLeft;

  constructor(private tournamentFacade: TournamentFacade, private router: Router) {}

  ngOnInit(): void {
    this.tournaments$ = this.tournamentFacade.tournaments$;
  }

  toggleForm(): void {
    this.formView = !this.formView;
  }

  toggleDropdown(): void {
    this.formatDropdownOpen = !this.formatDropdownOpen;
  }

  closeDropdown(): void {
    this.formatDropdownOpen = false;
  }

  setFormat(event: any, format: TournamentFormat): void {
    event.stopPropagation();
    this.toggleDropdown();
    this.formatControl.setValue(format);
  }
}
