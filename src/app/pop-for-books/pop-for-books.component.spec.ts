import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopForBooksComponent } from './pop-for-books.component';

describe('PopForBooksComponent', () => {
  let component: PopForBooksComponent;
  let fixture: ComponentFixture<PopForBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopForBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopForBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
