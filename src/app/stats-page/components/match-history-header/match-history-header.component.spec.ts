import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchHistoryHeaderComponent } from './match-history-header.component';

describe('MatchHistoryHeaderComponent', () => {
  let component: MatchHistoryHeaderComponent;
  let fixture: ComponentFixture<MatchHistoryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchHistoryHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchHistoryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
