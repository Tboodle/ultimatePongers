import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Match } from '../../models/match';
import { Player } from '../../models/player';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { PlayerFacade } from '../../data/player/player.facade';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-new-match-animation',
  templateUrl: './new-match-animation.component.html',
  styleUrls: ['./new-match-animation.component.scss'],
})
export class NewMatchAnimationComponent implements OnInit {
  match: Match;
  winner: Player;
  loser: Player;
  closed = false;
  middleText = 'Vs';
  playerConfig = {
    controls: 0,
    autoplay: 1,
    volume: 0.2,
  };

  @Output() closeModal = new EventEmitter<Player>();

  constructor(private playerFacade: PlayerFacade) {}

  ngOnInit(): void {
    const winner$ = this.playerFacade.getPlayerForId(this.match.id);
    const loser$ = this.playerFacade.getPlayerForId(this.loser.id);

    forkJoin([winner$, loser$]).subscribe((players: Player[]) => {
      this.winner = players[0];
      this.loser = players[1];
      this.playAnimation();
    });
  }

  private playAnimation() {
    const vsTimeline = gsap.timeline();
    const player1Timeline = gsap.timeline();
    const player2Timeline = gsap.timeline();

    //INITIAL
    gsap.set('#versus', { opacity: 0, xPercent: -50, yPercent: -50, top: '50%', left: '50%' });
    gsap.set('#score', { opacity: 0, xPercent: -50, yPercent: -50, top: '50%', left: '50%' });
    gsap.set('#player1', { opacity: 0, xPercent: -50, yPercent: -50, top: '50%', left: '0%' });
    gsap.set('#player2', { opacity: 0, xPercent: -50, yPercent: -50, top: '50%', left: '100%' });

    //STEP 1
    vsTimeline.to('#versus', {
      duration: 2,
      opacity: 1,
    });
    player1Timeline.to('#player1', {
      duration: 2,
      opacity: 1,
      left: '25%',
      ease: 'power3.inOut',
    });
    player2Timeline.to('#player2', {
      duration: 2,
      opacity: 1,
      left: '75%',
      ease: 'power3.inOut',
    });

    //STEP 2
    vsTimeline.to('#versus', {
      duration: 1,
      opacity: 0,
    });
    vsTimeline.to('#score', {
      duration: 1,
      opacity: 1,
    });

    //STEP 3
    player1Timeline.to('#player1', {
      delay: 3,
      duration: 2,
      left: '50%',
      top: '40%',
      ease: 'power3.inOut',
    });
    player2Timeline.to('#player2', {
      delay: 3,
      duration: 2,
      left: '50%',
      top: '60%',
      ease: 'power3.inOut',
    });

    //STEP 4
    player1Timeline
      .call(() => this.loadYoutubeScript(), [], 2)
      .then(() => {
        if (!this.closed) {
          this.playConfetti();
          setTimeout(() => this.closeModal.emit(), 3000);
        }
      });
  }

  @HostListener('document:keydown.escape', ['$event'])
  endAnimation() {
    this.closed = true;
    this.playConfetti();
    this.closeModal.emit();
  }

  loadYoutubeScript(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  handleYoutubeLoad(readyEvent: any) {
    const player = readyEvent.target;
    player.seekTo(this.winner?.victorySongStart || 0);
    player.setVolume(20);
  }

  private playConfetti() {
    const end = Date.now() + 2500;
    const colors = ['#FF2000', '#FE5607'];
    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}
