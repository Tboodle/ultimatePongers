import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from 'src/app/models/player';

@Component({
  selector: 'player-dropdown',
  templateUrl: './player-dropdown.component.html',
  styleUrls: ['./player-dropdown.component.scss']
})
export class PlayerDropdownComponent implements OnInit {

  @Input() players: Player[];
  @Input() fieldTitle: string;
  @Input() selectedPlayer: any;
  @Output() selectionEmitter = new EventEmitter<any>();
  @Output() scoreEmitter = new EventEmitter<number>();

  isOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectPlayer(event: Event, item: any) {
    event.stopPropagation();
    this.selectionEmitter.emit(item);
    this.toggleDropdown();
  }

  updateScore(number: number) {
    this.scoreEmitter.emit(number);
  }
}
