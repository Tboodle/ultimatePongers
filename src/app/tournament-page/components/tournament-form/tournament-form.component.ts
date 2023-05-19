import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Tournament } from 'src/app/shared/models/tournament';
import { TournamentFormat } from 'src/app/shared/models/tournamentFormat';

@Component({
  selector: 'tournament-form',
  templateUrl: './tournament-form.component.html',
  styleUrls: ['./tournament-form.component.scss'],
})
export class TournamentFormComponent {
  @Output() createEmitter = new EventEmitter<Tournament>();
  nameControl = new FormControl('');
  dateControl = new FormControl(new Date().toISOString().slice(0, 10));
  seededControl = new FormControl(false);
  formatControl = new FormControl('Single Elimination');
  formats = Object.values(TournamentFormat);
  formatDropdownOpen = false;

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

  createTournament(): void {
    console.log(this.dateControl.value);
    this.createEmitter.emit({
      name: this.nameControl.value,
      startDate: new Date(Date.parse(this.dateControl.value)),
      format: this.formatControl.value,
      seeded: this.seededControl.value,
      competitors: [],
    });
  }
}
