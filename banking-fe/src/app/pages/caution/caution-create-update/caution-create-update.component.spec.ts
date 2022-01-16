import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CautionCreateUpdateComponent } from './caution-create-update.component';

describe('CautionCreateUpdateComponent', () => {
  let component: CautionCreateUpdateComponent;
  let fixture: ComponentFixture<CautionCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CautionCreateUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CautionCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
