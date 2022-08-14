import { Match } from './match';

export interface Matchup {
  matches: Match[];
  player1Id: string;
  player2Id: string;
  player1Wins: number;
  player2Wins: number;
  player1Points: number;
  player2Points: number;
}
