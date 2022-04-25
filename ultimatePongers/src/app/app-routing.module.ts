import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompetitorsPageComponent } from './competitors-page/competitors-page.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'competitors', component: CompetitorsPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
