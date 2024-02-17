import { LiveMatch } from '../../models/liveMatch';
import { Match } from '../../models/match';

export class FetchMatchesAction {
  static readonly type = '[Match] Fetch Matches';
}

export class FetchLiveMatchesAction {
  static readonly type = '[Match] Fetch Live Matches';
}

export class FetchMachesForPlayerIdAction {
  static readonly type = '[Match] Fetch Matches for Player Id';
  constructor(public id: string) {}
}

export class AddMatchAction {
  static readonly type = '[Match] Add Match';
  constructor(public match: Match) {}
}

export class AddLiveMatchAction {
  static readonly type = '[Match] Add Live Match';
  constructor(public liveMatch: LiveMatch) {}
}

export class WatchForNewMatchAction {
  static readonly type = '[Match] Watch For New Match';
}
