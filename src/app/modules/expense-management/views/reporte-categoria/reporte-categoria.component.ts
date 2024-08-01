import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'src/app/core/constants/constants';
import { RelatorioCategoria } from 'src/app/core/models/result';
import { RelatorioService } from 'src/app/core/services/relatorio/relatorio.service';
import { DataBarchart } from 'src/app/shared/components/chart/model/data';

@Component({
  selector: 'app-reporte-categoria',
  templateUrl: './reporte-categoria.component.html',
  styleUrls: ['./reporte-categoria.component.scss'],
})
export class ReporteCategoriaComponent implements OnInit {
  loading: boolean = false;
  data: RelatorioCategoria[] = [];
  dataBar: DataBarchart[] = [];
  dataDonut: any[] = [];
  dataLine: any[] = [];

  legendNames: string[] = [];
  legendColors: string[] = CONSTANTS.COLORS;

  constructor(private _relatorioService: RelatorioService) {}

  ngOnInit(): void {
    this._getDataRelatorio();
  }

  private _getDataRelatorio() {
    this.loading = true;
    this._relatorioService.getRelatorioCategoria().subscribe(
      (response: any) => {
        this.loading = false;
        this.data = response ?? [];
        this.dataBar = this.data.map((it: RelatorioCategoria) => {
          this.legendNames.push(it.relatorioCategoria);

          return {
            x: it.relatorioValor,
            y: it.relatorioCategoria,
          };
        });

        this.dataDonut = this.data.map(
          (it: RelatorioCategoria, index: number) => {
            return {
              index: index,
              value: it.relatorioValor,
              color: this.legendColors[index],
              label: it.relatorioCategoria,
            };
          }
        );

        this.dataLine = this.data.map((it: RelatorioCategoria) => {
          return {
            x: it.relatorioValor,
            y: it.relatorioCategoria,
            tooltip:
              'Categoria: ' +
              it.relatorioCategoria +
              '<br/>' +
              'Valor: ' +
              it.relatorioValor,
          };
        });
      },
      (error) => {}
    );
  }
}
