import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.scss']
})
export class DropdownInputComponent implements OnInit {

  @Input() data: any[];
  @Input() fieldTitle: string;
  @Input() selectedData: any;
  @Output() selectionEmitter = new EventEmitter<any>();

  isOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectItem(event: Event, item: any) {
    event.stopPropagation();
    this.selectionEmitter.emit(item);
    this.toggleDropdown();
  }
}
