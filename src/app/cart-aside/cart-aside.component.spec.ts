import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartAsideComponent } from './cart-aside.component';

describe('CartAsideComponent', () => {
  let component: CartAsideComponent;
  let fixture: ComponentFixture<CartAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
