import { Tournament } from '../../models/tournament';

export class FetchTournamentsAction {
  static readonly type = '[Tournament] Fetch Tournaments';
}
export class CreateTournamentAction {
  static readonly type = '[Tournament] Create Tournament';
  constructor(public tournament: Tournament) {}
}
export class AddPlayerToTournamentAction {
  static readonly type = '[Tournament] App Player to Tournament';
  constructor(public tournament: Tournament, public playerId: string) {}
}
