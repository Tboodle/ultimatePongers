import { Component, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { Match } from '../../../shared/match';
import { AddMatchModalComponent } from './add-match-modal/add-match-modal/add-match-modal.component';
import { MatchService } from './services/match.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ultimatePongers';
  addMatchModal: ComponentRef<AddMatchModalComponent>;

  constructor(private router: Router, private vcr: ViewContainerRef, private matchService: MatchService) { }

  isHomePage() {
    return this.router.url.endsWith('/');
  }

  isCompetitorsPage() {
    return this.router.url.endsWith('/competitors');
  }

  showAddMatchModal() {
    this.addMatchModal = this.vcr.createComponent(AddMatchModalComponent);
    this.addMatchModal.instance.closeModal.subscribe((match?: Match) => { if (match) { this.matchService.addMatch(match); } this.vcr.clear(); });
  }
}
