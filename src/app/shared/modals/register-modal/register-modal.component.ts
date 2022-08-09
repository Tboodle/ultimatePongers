import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { uuidv4 } from '@firebase/util';
import { Player } from '../../models/player';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<any>();

  newPlayerForm = new FormGroup({
    name: new FormControl(''),
    nickName: new FormControl(''),
  });
  newPlayer: Player = {
    id: '',
    name: this.newPlayerForm.get('name')?.value,
    email: '',
    nickName: this.newPlayerForm.get('name')?.value,
    wins: 0,
    losses: 0,
    elo: 400,
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.newPlayer.email = user.email || '';
      this.newPlayer.photoUrl = user.photoURL || '';
      this.newPlayerForm.get('name')?.setValue(user.displayName || '');
    });
  }

  registerPlayer() {
    this.closeModal.emit({
      ...this.newPlayer,
      name: this.newPlayerForm.get('name')?.value,
      nickName: this.newPlayerForm.get('nickName')?.value,
    });
  }
}
