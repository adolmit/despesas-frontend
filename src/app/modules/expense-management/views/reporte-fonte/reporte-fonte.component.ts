import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'src/app/core/constants/constants';
import { RelatorioFonte } from 'src/app/core/models/result';
import { RelatorioService } from 'src/app/core/services/relatorio/relatorio.service';
import { DataBarchart } from 'src/app/shared/components/chart/model/data';

@Component({
  selector: 'app-reporte-fonte',
  templateUrl: './reporte-fonte.component.html',
  styleUrls: ['./reporte-fonte.component.scss'],
})
export class ReporteFonteComponent implements OnInit {
  loading: boolean = false;
  data: RelatorioFonte[] = [];
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
    this._relatorioService.getRelatorioFonte().subscribe(
      (response: any) => {
        this.loading = false;
        this.data = response ?? [];

        this.dataBar = this.data.map((it: RelatorioFonte) => {
          this.legendNames.push(it.relatorioFonte);

          return {
            x: it.relatorioValor,
            y: it.relatorioFonte,
          };
        });

        this.dataDonut = this.data.map((it: RelatorioFonte, index: number) => {
          return {
            index: index,
            value: it.relatorioValor,
            color: this.legendColors[index],
            label: it.relatorioFonte,
          };
        });

        this.dataLine = this.data.map((it: RelatorioFonte) => {
          return {
            x: it.relatorioValor,
            y: it.relatorioFonte,
            tooltip:
              'Fonte: ' +
              it.relatorioFonte +
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
