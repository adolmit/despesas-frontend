import { Component, OnInit } from '@angular/core';
import { DataRecord, DataResult } from 'src/app/core/models/result';
import { ExpenseService } from 'src/app/core/services/expense.service';
import { DataBarchart } from 'src/app/shared/components/chart/model/data';
import { BehaviorSubject } from 'rxjs';
import { IChangePaginate } from 'src/app/shared/components/table-footer-pagination/table-footer-pagination.component';
import { ExpenseTable } from './model/expense';
import { IBreadcrumb } from 'src/app/shared/components/breadcrumbs/breadcrumbs.component';

type IQueryFilter = {
  page: number;
  pageSize?: number;
};

export const OPTIONS = {
  SEARCH: 'SEARCH',
  GRAPH1: 'GRAPH1',
  GRAPH2: 'GRAPH2',
  GRAPH3: 'GRAPH3',
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  tabActivo = OPTIONS.SEARCH;
  TABS = OPTIONS;

  data: DataBarchart[] = [];
  dataDonut: any[] = [];
  dataLine: any[] = [];

  result!: DataResult;

  selectedItem: ExpenseTable;
  records: ExpenseTable[] = [];

  loading: boolean = false;
  totalItems = 0;
  private _queryFilter = new BehaviorSubject<IQueryFilter | null>(null);
  breadcrumbs: IBreadcrumb[] = [
    { nombre: 'Organizações' },
    { nombre: 'Secretaria de Finanças' },
    { nombre: ' Despesas Orçamentárias' },
    { nombre: 'Despesas orçamentárias - 2017 ', active: true },
  ];
  constructor(private _expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.data = [
      { y: 'Janeiro', x: 100 },
      { y: 'Fevereiro', x: 50 },
      { y: 'Março', x: 500 },
      { y: 'Abril', x: 100 },
      { y: 'Maio', x: 50 },
      { y: 'Junho', x: 500 },
      { y: 'Julho', x: 100 },
      { y: 'Agosto', x: 50 },
      { y: 'Setembro', x: 500 },
      { y: 'Outubro', x: 50 },
      { y: 'Novembro', x: 500 },
      { y: 'Dezembro', x: 50 },
    ];

    this.dataDonut = [
      { value: 10, color: '#CCC' },
      { value: 20, color: '#F00' },
      { value: 70, color: '#0FC' },
    ];

    this.dataLine = [
      { x: 'Janeiro', y: 100 },
      { x: 'Fevereiro', y: 50 },
      { x: 'Março', y: 500 },
      { x: 'Abril', y: 100 },
      { x: 'Maio', y: 50 },
      { x: 'Junho', y: 500 },
      { x: 'Julho', y: 100 },
      { x: 'Agosto', y: 50 },
      { x: 'Setembro', y: 500 },
      { x: 'Outubro', y: 50 },
      { x: 'Novembro', y: 500 },
      { x: 'Dezembro', y: 50 },
    ];

    this._getData({ page: 1, pageSize: 10 });
  }

  private _getData(queryRaw: IQueryFilter) {
    this.loading = true;
    this._expenseService
      .getData((queryRaw.page - 1) * queryRaw.pageSize, queryRaw.pageSize)
      .subscribe(
        (response: any) => {
          //this.result = response;
          this.loading = false;
          this.totalItems = response.total ?? 0;
          this.records = response.records ?? [];
          console.log('RESULT', this.records);
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
    this._getData({ page: event.page, pageSize: event.pageSize });
  }

  onSelectedItem(item: ExpenseTable) {
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
