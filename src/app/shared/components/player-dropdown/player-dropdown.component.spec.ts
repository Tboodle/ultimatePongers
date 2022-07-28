import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownInputComponent } from './player-dropdown.component';

describe('DropdownInputComponent', () => {
  let component: DropdownInputComponent;
  let fixture: ComponentFixture<DropdownInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});