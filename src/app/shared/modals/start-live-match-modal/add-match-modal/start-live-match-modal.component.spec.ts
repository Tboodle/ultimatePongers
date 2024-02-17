import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMatchModalComponent } from './start-live-match-modal.component';

describe('AddMatchModalComponent', () => {
  let component: AddMatchModalComponent;
  let fixture: ComponentFixture<AddMatchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMatchModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMatchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
