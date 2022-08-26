import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../../models/player';

@Component({
  selector: 'player-dropdown',
  templateUrl: './player-dropdown.component.html',
  styleUrls: ['./player-dropdown.component.scss'],
})
export class PlayerDropdownComponent {
  @Input() players: Player[];
  @Input() fieldTitle: string;
  @Input() selectedPlayer: any;
  @Input() scoreEnabled = true;
  @Output() selectionEmitter = new EventEmitter<any>();
  @Output() scoreEmitter = new EventEmitter<number>();

  isOpen = false;

  score: number = 0;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectPlayer(event: Event, item: any) {
    event.stopPropagation();
    this.selectionEmitter.emit(item);
    this.toggleDropdown();
  }

  updateScore(event: any) {
    this.scoreEmitter.emit(event.target.value);
  }
}
