import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMesComponent } from './reporte-mes.component';

describe('ReporteMesComponent', () => {
  let component: ReporteMesComponent;
  let fixture: ComponentFixture<ReporteMesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteMesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteMesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
