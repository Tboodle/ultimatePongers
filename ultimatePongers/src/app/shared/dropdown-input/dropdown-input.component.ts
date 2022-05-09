import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.scss']
})
export class DropdownInputComponent implements OnInit {

  @Input() data: any[];
  @Input() fieldTitle: string;
  @Output() selectionEmitter = new EventEmitter<any>();

  optionsElement: HTMLElement;

  constructor() { }

  ngOnInit(): void {
    this.optionsElement = document.getElementById('options')!;
  }

  displayOptions() {
    this.optionsElement.classList.remove('hidden');
  }

  hideOptions() {
    this.optionsElement.classList.add('hidden');
  }

}
