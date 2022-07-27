import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CompetitorsPageComponent } from './competitors-page/competitors-page.component';
import {
  LeaderboardComponent,
 } from './home-page/components/leaderboard/leaderboard.component';
import { RecentMatchesComponent } from './home-page/components/recent-matches/recent-matches.component';
import { MatchPlayerDisplayComponent } from './home-page/components/match-player-display/match-player-display.component';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { AddMatchModalComponent } from './add-match-modal/add-match-modal/add-match-modal.component';
import { PlayerDropdownComponent } from './shared/player-dropdown/player-dropdown.component';
import { HoverClassDirective } from './directives/hover-class.directive';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { SortPlayersByWinsPipe } from './pipes/sort-players-by-win.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CompetitorsPageComponent,
    LeaderboardComponent,
    RecentMatchesComponent,
    MatchPlayerDisplayComponent,
    FormatDatePipe,
    SortPlayersByWinsPipe,
    AddMatchModalComponent,
    PlayerDropdownComponent,
    HoverClassDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
