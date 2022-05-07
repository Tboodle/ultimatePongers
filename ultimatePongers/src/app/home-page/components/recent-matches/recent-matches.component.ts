import { Component, Input, OnInit } from '@angular/core';
import { Match } from 'src/app/models/match';
import { Player } from 'src/app/models/player';
import { PlayerService } from 'src/app/services/player-service.service';

@Component({
  selector: 'app-recent-matches',
  templateUrl: './recent-matches.component.html',
  styleUrls: ['./recent-matches.component.scss']
})
export class RecentMatchesComponent implements OnInit {
  @Input() matches: Match[];
  @Input() players: Player[];

  constructor() { }

  ngOnInit(): void {
  }

  getPlayer(id: string): Player {
    return this.players.find((player) => player.id === id)!;
  }

}
