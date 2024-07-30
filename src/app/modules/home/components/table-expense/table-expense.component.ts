import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExpenseTable } from '../../model/expense';
import { DataRecord } from 'src/app/core/models/result';
import { IChangePaginate } from 'src/app/shared/components/table-footer-pagination/table-footer-pagination.component';

@Component({
  selector: 'app-table-expense',
  templateUrl: './table-expense.component.html',
  styleUrls: ['./table-expense.component.scss'],
})
export class TableExpenseComponent implements OnInit {
  @Input() datasource: ExpenseTable[];

  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;

  @Input() loading: boolean = false;
  @Input() rowSelected: ExpenseTable | null = null;

  @Output() selected = new EventEmitter<ExpenseTable>();
  @Output() paginar = new EventEmitter<IChangePaginate>();

  ngOnInit(): void {
    /**
     * Method is
     * empty
     */
  }

  onSeleccionarFila(fila: ExpenseTable) {
    this.selected.emit(fila);
  }

  onChangePaginate(event: IChangePaginate) {
    if (!this.totalItems) return;

    const { page, pageSize } = event;

    // hack para evitar lanzar el request cuando la pagina es > 1 y se cambia de pageSize
    // solo aplicado cuando la paginacion es desde backend
    //if (page == this.totalItems / this.pageSize || page < 1) {
    //  return;
    //}

    this.paginar.emit(event);
  }

  get itemId() {
    return Number(this.rowSelected?._id ?? 0);
  }
}
