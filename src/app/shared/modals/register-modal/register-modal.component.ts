import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, switchMap } from 'rxjs';
import { Player } from '../../models/player';
import { AuthService } from '../../services/auth.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegisterModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<Player>();

  newPlayerForm = new FormGroup({
    name: new FormControl(''),
    nickName: new FormControl(''),
    song: new FormControl(''),
    songTime: new FormControl(0),
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

  youtubeBaseUrl = 'https://www.youtube.com/watch?v=';

  constructor(private authService: AuthService, private playerService: PlayerService) {}

  ngOnInit(): void {
    this.authService.user$
      .pipe(switchMap((user) => this.playerService.getPlayerForEmail(user.email || '')))
      .subscribe((player: Player) => {
        this.newPlayer.email = player.email || '';
        this.newPlayer.photoUrl = player.photoUrl || '';
        this.newPlayerForm.get('name')?.setValue(player.name || '');
        this.newPlayerForm.get('nickName')?.setValue(player.nickName || '');
        this.newPlayerForm
          .get('song')
          ?.setValue(
            (player.victorySongId ? this.youtubeBaseUrl + player.victorySongId : '') +
              (player.victorySongStart ? '&t=' + player.victorySongStart : ''),
          );
        this.newPlayerForm.get('songTime')?.setValue(player.victorySongStart || 0);
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
      songId = songUrl.split('.be/')[1].slice(0, 11);
    } else {
      songId = songUrl.split('v=')[1].slice(0, 11);
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
