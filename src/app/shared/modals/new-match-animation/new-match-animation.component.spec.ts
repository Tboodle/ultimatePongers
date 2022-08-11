import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMatchAnimationComponent } from './new-match-animation.component';

describe('NewMatchAnimationComponent', () => {
  let component: NewMatchAnimationComponent;
  let fixture: ComponentFixture<NewMatchAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewMatchAnimationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMatchAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
