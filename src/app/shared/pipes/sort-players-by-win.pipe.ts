import { Pipe, PipeTransform } from "@angular/core";
import { Player } from "../models/player";

@Pipe({name: 'sortPlayersByWins'})
export class SortPlayersByWinsPipe implements PipeTransform {
  transform(players: Player[]): Player[] {
    return players.sort((player1, player2) => player2.wins - player1.wins);
  }
}