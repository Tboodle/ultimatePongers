import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CompetitorsPageComponent } from './competitors-page/competitors-page.component';
import { LeaderboardComponent } from './home-page/components/leaderboard/leaderboard.component';
import { RecentMatchesComponent } from './home-page/components/recent-matches/recent-matches.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CompetitorsPageComponent,
    LeaderboardComponent,
    RecentMatchesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
