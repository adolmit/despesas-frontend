import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteFonteComponent } from './reporte-fonte.component';

describe('ReporteFonteComponent', () => {
  let component: ReporteFonteComponent;
  let fixture: ComponentFixture<ReporteFonteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteFonteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteFonteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
