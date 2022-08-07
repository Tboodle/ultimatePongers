import { Pipe, PipeTransform } from "@angular/core";
import { Player } from "../models/player";

@Pipe({name: 'sortPlayersByElo'})
export class SortPlayersByEloPipe implements PipeTransform {
  transform(players: Player[]): Player[] {
    return players.sort((player1, player2) => player2.elo - player1.elo);
  }
}