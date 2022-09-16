import { Match } from '../../models/match';

export class FetchMatchesAction {
  static readonly type = '[Match] Fetch Matches';
}

export class FetchMachesForPlayerIdAction {
  static readonly type = '[Match] Fetch Matches for Player Id';
  constructor(public id: string) {}
}

export class AddMatchAction {
  static readonly type = '[Match] Add Match';
  constructor(public match: Match) {}
}
