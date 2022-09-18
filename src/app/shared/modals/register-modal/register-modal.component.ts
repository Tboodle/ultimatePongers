import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'firebase/auth';
import { switchMap } from 'rxjs';
import { AuthService } from '../../data/auth/auth.service';
import { PlayerFacade } from '../../data/player/player.facade';
import { Player } from '../../models/player';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<Player>();

  user: User;
  newPlayerForm = new FormGroup({
    name: new FormControl(''),
    nickName: new FormControl(''),
    song: new FormControl(''),
    songTime: new FormControl(0),
  });
  newPlayer: Player = {
    id: '',
    name: '',
    email: '',
    nickName: '',
    wins: 0,
    losses: 0,
    elo: 400,
  };
  youtubeBaseUrl = 'https://www.youtube.com/watch?v=';

  constructor(private authService: AuthService, private playerFacade: PlayerFacade) {}

  ngOnInit(): void {
    this.authService.user$
      .pipe(
        switchMap((user) => {
          this.user = user;
          return this.playerFacade.getPlayerForEmail(user.email || '');
        }),
      )
      .subscribe((player: Player) => {
        if (player) {
          this.newPlayer = player;
        } else {
          this.newPlayer.email = this.user?.email || '';
          this.newPlayer.name = this.user?.displayName || '';
          this.newPlayer.photoUrl = this.user?.photoURL || '';
        }
        this.newPlayerForm.get('email')?.setValue(this.newPlayer.email);
        this.newPlayerForm.get('name')?.setValue(this.newPlayer.name);
        this.newPlayerForm.get('phoyoUrl')?.setValue(this.newPlayer.photoUrl);
        this.newPlayerForm.get('nickName')?.setValue(this.newPlayer?.nickName || '');
        this.newPlayerForm
          .get('song')
          ?.setValue(
            (this.newPlayer?.victorySongId
              ? this.youtubeBaseUrl + this.newPlayer?.victorySongId
              : '') +
              (this.newPlayer?.victorySongStart ? '&t=' + this.newPlayer?.victorySongStart : ''),
          );
        this.newPlayerForm.get('songTime')?.setValue(this.newPlayer?.victorySongStart || 0);
      });
  }

  @HostListener('document:keydown.escape', ['$event'])
  exitModal() {
    this.closeModal.emit();
  }

  registerPlayer() {
    const songUrl = this.newPlayerForm.get('song')?.value;
    let songId: string;
    if (songUrl.includes('youtu.be/')) {
      songId = songUrl?.split('.be/')[1]?.slice(0, 11) || '';
    } else {
      songId = songUrl?.split('v=')[1]?.slice(0, 11) || '';
    }
    this.closeModal.emit({
      ...this.newPlayer,
      name: this.newPlayerForm.get('name')?.value,
      nickName: this.newPlayerForm.get('nickName')?.value,
      victorySongId: songId,
      victorySongStart: this.newPlayerForm.get('songTime')?.value,
    });
  }

  guessStartingTime() {
    const songUrl = this.newPlayerForm.get('song')?.value;
    if (songUrl) {
      const timeValue = songUrl.split('t=')[1]?.split('&')[0];
      if (timeValue) {
        this.newPlayerForm.get('songTime')?.setValue(Number(timeValue));
      }
    }
  }
}
