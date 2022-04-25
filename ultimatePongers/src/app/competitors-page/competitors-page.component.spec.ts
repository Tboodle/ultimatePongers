import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitorsPageComponent } from './competitors-page.component';

describe('CompetitorsPageComponent', () => {
  let component: CompetitorsPageComponent;
  let fixture: ComponentFixture<CompetitorsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitorsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitorsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
