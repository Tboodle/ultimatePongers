import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { User } from 'firebase/auth';
import { AuthService } from '../../data/auth/auth.service';
import { PlayerFacade } from '../../data/player/player.facade';
import { Player } from '../../models/player';

@Component({
  selector: 'app-register-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
})
export class AuthModalComponent {
  @Output() closeModal = new EventEmitter<Player>();

  constructor(private authService: AuthService, private playerFacade: PlayerFacade) {}

  loginWithGoogle() {
    console.log('google login');
    this.authService.authenitcateUserWithGoogle();
  }

  loginWithMicrosoft() {
    console.log('microsoft login');
    this.authService.authenitcateUserWithMicrosoft();
  }

  @HostListener('document:keydown.escape', ['$event'])
  exitModal() {
    this.closeModal.emit();
  }
}
