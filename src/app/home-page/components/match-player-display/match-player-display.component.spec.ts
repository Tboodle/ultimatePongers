import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchPlayerDisplayComponent } from './match-player-display.component';

describe('MatchPlayerDisplayComponent', () => {
  let component: MatchPlayerDisplayComponent;
  let fixture: ComponentFixture<MatchPlayerDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchPlayerDisplayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchPlayerDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
