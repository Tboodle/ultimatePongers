import {Component, Input, OnInit} from '@angular/core';
import { Player } from 'src/app/shared/models/player';

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

