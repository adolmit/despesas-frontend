import { Component, OnInit } from '@angular/core';
import { MovimentacaoTable } from '../../models/movimentacao';
import { IBreadcrumb } from 'src/app/shared/components/breadcrumbs/breadcrumbs.component';
import { MovimentacoPage } from 'src/app/core/models/result';
import { IChangePaginate } from 'src/app/shared/components/table-footer-pagination/table-footer-pagination.component';
import { BehaviorSubject } from 'rxjs';
import { MovimentacaoService } from 'src/app/core/services/movimentacao/movimentacao.service';

type IQueryFilter = {
  page: number;
  pageSize?: number;
};

const TABS = {
  BUSQUEDA: 'busqueda',
  RELATORIO_MES: 'relatorio-mes',
  RELATORIO_CATEGORIA: 'relatorio-categoria',
  RELATORIO_FONTE: 'relatorio-fonte',
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  tabActivo = TABS.BUSQUEDA;
  TABS = TABS;

  selectedItem: MovimentacaoTable;
  data: MovimentacaoTable[] = [];

  loading: boolean = false;
  totalItems = 0;

  breadcrumbs: IBreadcrumb[] = [
    { nombre: 'Organizações' },
    { nombre: 'Secretaria de Finanças' },
    { nombre: ' Despesas Orçamentárias' },
    { nombre: 'Despesas orçamentárias - 2017 ', active: true },
  ];
  private _queryFilter = new BehaviorSubject<IQueryFilter | null>(null);

  constructor(private _movimentacaoService: MovimentacaoService) {}

  ngOnInit(): void {
    this._getDataMovimentacao({ page: 1, pageSize: 10 });
  }

  private _getDataMovimentacao(queryRaw: IQueryFilter) {
    this.loading = true;
    this._movimentacaoService
      .getMovimentacoes(queryRaw.page, queryRaw.pageSize)
      .subscribe(
        (response: any) => {
          this.loading = false;
          this.totalItems = response.nroElementos ?? 0;
          this.data = response.data ?? [];
        },
        (error) => {}
      );
  }

  onChangePaginacion(event: IChangePaginate) {
    const merge = {
      ...this.actualFiltro,
      page: event.page,
      pageSize: event.pageSize,
    };

    //this._queryFilter.next(merge);
    this.selectedItem = null;
    this._getDataMovimentacao({ page: event.page, pageSize: event.pageSize });
  }

  onSelectedItem(item: MovimentacaoTable) {
    if (item) this.selectedItem = item;
  }

  get actualFiltro() {
    return this._queryFilter.value;
  }

  get page() {
    return this._queryFilter.value?.page;
  }

  get pageSize() {
    return this._queryFilter.value?.pageSize;
  }
}
