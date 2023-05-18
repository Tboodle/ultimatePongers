import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { StatsPageComponent } from './stats-page/stats-page.component';
import { TournamentPageComponent } from './tournament-page/tournament-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'player/:id',
    component: StatsPageComponent,
  },
  {
    path: 'tournament',
    component: TournamentPageComponent,
  },
  {
    path: 'tournament/:id',
    component: TournamentPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
