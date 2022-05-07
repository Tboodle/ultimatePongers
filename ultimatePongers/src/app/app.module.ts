import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CompetitorsPageComponent } from './competitors-page/competitors-page.component';
import { LeaderboardComponent } from './home-page/components/leaderboard/leaderboard.component';
import { RecentMatchesComponent } from './home-page/components/recent-matches/recent-matches.component';
import { MatchPlayerDisplayComponent } from './home-page/components/match-player-display/match-player-display.component';
import { FormatDatePipe } from './pipes/format-date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CompetitorsPageComponent,
    LeaderboardComponent,
    RecentMatchesComponent,
    MatchPlayerDisplayComponent,
    FormatDatePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
