import { Component, OnInit } from '@angular/core';
import { Match } from '../models/match';
import { Player } from '../models/player';
import { MatchService } from '../services/match-service.service';
import { PlayerService } from '../services/player-service.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  players: Player[] = [];
  matches: Match[] = [];

  constructor(private playerService: PlayerService, private matchService: MatchService) { }

  ngOnInit(): void {
    this.players = this.playerService.getPlayers();
    this.matches = this.matchService.getMatches();
  }

}
