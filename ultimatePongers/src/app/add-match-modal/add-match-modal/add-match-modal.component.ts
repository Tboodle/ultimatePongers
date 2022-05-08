import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-match-modal',
  templateUrl: './add-match-modal.component.html',
  styleUrls: ['./add-match-modal.component.scss']
})
export class AddMatchModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<null>();

  constructor() { }

  ngOnInit(): void {
  }

}
