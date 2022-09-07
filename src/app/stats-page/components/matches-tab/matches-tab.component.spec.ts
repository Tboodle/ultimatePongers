import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesTabComponent } from './matches-tab.component';

describe('MatchesTabComponent', () => {
  let component: MatchesTabComponent;
  let fixture: ComponentFixture<MatchesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchesTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
