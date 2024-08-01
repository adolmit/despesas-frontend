import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMovimentacaoComponent } from './table-movimentacao.component';

describe('TableExpenseComponent', () => {
  let component: TableMovimentacaoComponent;
  let fixture: ComponentFixture<TableMovimentacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableMovimentacaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableMovimentacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
