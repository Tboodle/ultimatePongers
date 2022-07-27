import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../../../../../../shared/player';

@Component({
  selector: 'match-player-display',
  templateUrl: './match-player-display.component.html',
  styleUrls: ['./match-player-display.component.scss'],
})
export class MatchPlayerDisplayComponent implements OnInit {
  @Input() player: Player;

  constructor() { }

  ngOnInit(): void {
  }
}

