import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Match } from '../../models/match';
import { Player } from '../../models/player';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-new-match-animation',
  templateUrl: './new-match-animation.component.html',
  styleUrls: ['./new-match-animation.component.scss'],
})
export class NewMatchAnimationComponent implements OnInit {
  match: Match;
  winner: Player;
  loser: Player;

  @Output() closeModal = new EventEmitter<Player>();

  ngOnInit(): void {
    gsap.timeline();

    //INITIAL
    gsap.set('#versus', { opacity: 0, xPercent: -50, yPercent: -50, top: '50%', left: '50%' });
    gsap.set('#player1', { opacity: 0, xPercent: -50, yPercent: -50, top: '50%', left: '0%' });
    gsap.set('#player2', { opacity: 0, xPercent: -50, yPercent: -50, top: '50%', left: '100%' });

    //STEP 1
    gsap.to('#versus', {
      duration: 2,
      opacity: 1,
    });
    gsap.to('#player1', {
      duration: 2,
      opacity: 1,
      left: '25%',
      ease: 'power3.inOut',
    });
    gsap.to('#player2', {
      duration: 2,
      opacity: 1,
      left: '75%',
      ease: 'power3.inOut',
    });

    //STEP 2
    gsap.to('#versus', {
      delay: 3,
      duration: 2,
      opacity: 0,
    });
    gsap.to('#player1', {
      delay: 3,
      duration: 2,
      left: '50%',
      top: '40%',
      ease: 'power3.inOut',
    });
    gsap.to('#player2', {
      delay: 3,
      duration: 2,
      opacity: 1,
      left: '50%',
      top: '60%',
      ease: 'power3.inOut',
    });

    //STEP 3
    const colors = ['#FF2000', '#FE5607'];
    setTimeout(() => {
      var end = Date.now() + 2500;
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
    }, 5000);

    setTimeout(() => this.closeModal.emit(), 8000);
  }
}
