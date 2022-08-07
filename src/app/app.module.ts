import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CompetitorsPageComponent } from './competitors-page/competitors-page.component';
import { LeaderboardComponent } from './home-page/components/leaderboard/leaderboard.component';
import { RecentMatchesComponent } from './home-page/components/recent-matches/recent-matches.component';
import { MatchPlayerDisplayComponent } from './home-page/components/match-player-display/match-player-display.component';
import { FormatDatePipe } from './shared/pipes/format-date.pipe';
import { AddMatchModalComponent } from './shared/modals/add-match-modal/add-match-modal/add-match-modal.component';
import { HoverClassDirective } from './directives/hover-class.directive';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { SortPlayersByEloPipe } from './shared/pipes/sort-players-by-elo.pipe';
import { AuthService } from './shared/services/auth.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { RegisterModalComponent } from './shared/modals/register-modal/register-modal.component';
import { PlayerDropdownComponent } from './shared/components/player-dropdown/player-dropdown.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CompetitorsPageComponent,
    LeaderboardComponent,
    RecentMatchesComponent,
    MatchPlayerDisplayComponent,
    FormatDatePipe,
    SortPlayersByEloPipe,
    AddMatchModalComponent,
    PlayerDropdownComponent,
    HoverClassDirective,
    RegisterModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
