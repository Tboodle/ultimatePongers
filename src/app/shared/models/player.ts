export interface Player {
  id: string;
  email: string;
  name: string;
  nickName?: string;
  paddle?: string;
  photoUrl?: string;
  wins: number;
  losses: number;
  elo: number;
  victorySongId?: string;
  victorySongStart?: number;
  hidden?: boolean;
  decaying?: boolean;
}
