import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompetitorsPageComponent } from './competitors-page/competitors-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  // {
  //   path: 'competitors',
  //   canActivate: [AngularFireAuthGuard],
  //   data: { authGuardPipe: redirectUnauthorizedToLogin },
  //   component: CompetitorsPageComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
