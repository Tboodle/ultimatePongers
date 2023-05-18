import { Component, Input } from '@angular/core';
import { Tournament } from 'src/app/shared/models/tournament';
import { faArrowRight, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'tournament-card',
  templateUrl: './tournament-card.component.html',
  styleUrls: ['./tournament-card.component.scss'],
})
export class TournamentCardComponent {
  @Input() tournament: Tournament;

  faArrowRight = faArrowRight;
  faCalendar = faCalendar;
  faUser = faUser;

  constructor(private router: Router) {}

  getStatusLabel(): string {
    const now = Date.now();
    if (Date.parse(this.tournament.startDate).valueOf() > now) {
      return 'Starting Soon';
    } else if (this.tournament.championId) {
      return 'Finished';
    } else {
      return 'In Progress';
    }
  }

  getRoundLabel(): string {
    return 'Round 1';
  }

  isActive(): boolean {
    const now = Date.now();
    return !this.tournament.championId && Date.parse(this.tournament.startDate) <= now;
  }

  getStatusColor(): string {
    const now = Date.now();
    if (Date.parse(this.tournament.startDate) > now) {
      return 'bg-red-100 text-red-700';
    } else if (this.tournament.championId) {
      return 'bg-yellow-100 bg-yellow-700';
    } else {
      return 'bg-green-100 text-green-700';
    }
  }

  navigateToTournamentPage(): void {
    this.router.navigateByUrl(`/tournament/${this.tournament.id}`);
  }
}
