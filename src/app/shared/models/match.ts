export interface  Match {
  id: string;
  loserId: string;
  winnerId: string;
  winnerScore: number;
  loserScore: number;
  winnerStartElo?: number;
  winnerEndElo?: number;
  loserStartElo?: number;
  loserEndElo?: number;
  date: any;
}
