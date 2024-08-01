import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCategoriaComponent } from './reporte-categoria.component';

describe('ReporteCategoriaComponent', () => {
  let component: ReporteCategoriaComponent;
  let fixture: ComponentFixture<ReporteCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteCategoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
