import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';

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
