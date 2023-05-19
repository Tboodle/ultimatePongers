export interface Tournament {
  id?: string;
  creatorId?: string;
  startDate: any;
  championId?: string;
  name: string;
  format: string;
  seeded: boolean;
  competitors: string[];
}
