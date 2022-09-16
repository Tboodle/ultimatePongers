import { Match } from '../../models/match';
import { Player } from '../../models/player';

export class FetchPlayersAction {
  static readonly type = '[Player] Fetch Players';
}

export class UpdatePlayersForMatchAction {
  static readonly type = '[Player] Update Players For Match';
  constructor(public match: Match) {}
}

export class SetCurrentPlayerAction {
  static readonly type = '[Player] Set Current Player';
  constructor(public email: string) {}
}

export class UpdatePlayerAction {
  static readonly type = '[Player] Update Player';
  constructor(public player: Player) {}
}
