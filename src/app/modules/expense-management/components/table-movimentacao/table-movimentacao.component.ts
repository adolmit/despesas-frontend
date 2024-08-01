import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IChangePaginate } from 'src/app/shared/components/table-footer-pagination/table-footer-pagination.component';
import { MovimentacaoTable } from '../../models/movimentacao';

@Component({
  selector: 'app-table-movimentacao',
  templateUrl: './table-movimentacao.component.html',
  styleUrls: ['./table-movimentacao.component.scss'],
})
export class TableMovimentacaoComponent implements OnInit {
  @Input() datasource: MovimentacaoTable[];
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 10;

  @Input() loading: boolean = false;
  @Input() rowSelected: MovimentacaoTable | null = null;

  @Output() selected = new EventEmitter<MovimentacaoTable>();
  @Output() paginar = new EventEmitter<IChangePaginate>();

  ngOnInit(): void {
    /**
     * Method is
     * empty
     */
  }

  onSeleccionarFila(fila: MovimentacaoTable) {
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
    return Number(this.rowSelected?.id ?? 0);
  }
}
