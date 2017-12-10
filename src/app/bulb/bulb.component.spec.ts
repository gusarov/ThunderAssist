import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulbComponent } from './bulb.component';

describe('BulbComponent', () => {
  let component: BulbComponent;
  let fixture: ComponentFixture<BulbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
