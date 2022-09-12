import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { Player } from '../../models/player';

@Component({
  selector: 'player-dropdown',
  templateUrl: './player-dropdown.component.html',
  styleUrls: ['./player-dropdown.component.scss'],
})
export class PlayerDropdownComponent implements OnChanges, AfterViewChecked {
  @Input() players: Player[];
  @Input() fieldTitle: string;
  @Input() selectedPlayer: any;
  @Input() scoreEnabled = true;
  @Input() flatView = false;
  @Output() selectionEmitter = new EventEmitter<any>();
  @Output() scoreEmitter = new EventEmitter<number>();

  @ViewChild('playerTypeahead') inputElement: ElementRef;

  isOpen = false;
  filteredPlayers: Player[];

  score: number = 0;

  ngOnChanges(): void {
    this.filteredPlayers = this.players;
  }

  ngAfterViewChecked(): void {
    if (this.isOpen) {
      this.inputElement.nativeElement.focus();
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  unfocusTypeahead() {
    setTimeout(() => {
      this.closeDropdown();
    }, 200);
  }

  selectPlayer(event: Event, item: any) {
    event.stopPropagation();
    this.toggleDropdown();
    this.selectionEmitter.emit(item);
    this.filteredPlayers = this.players;
  }

  updateScore(event: any) {
    this.scoreEmitter.emit(event.target.value);
  }

  handleTypeaheadChange(inputEvent: any) {
    const input = inputEvent.target.value;
    this.filteredPlayers = this.players.filter(
      (player) =>
        player.name.toLowerCase().includes(input.toLowerCase()) ||
        player.nickName?.toLowerCase().includes(input.toLowerCase()),
    );
  }
}
