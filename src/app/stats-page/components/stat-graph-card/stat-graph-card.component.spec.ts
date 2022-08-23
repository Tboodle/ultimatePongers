import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatGraphCardComponent } from './stat-graph-card.component';

describe('StatGraphCardComponent', () => {
  let component: StatGraphCardComponent;
  let fixture: ComponentFixture<StatGraphCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatGraphCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatGraphCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
