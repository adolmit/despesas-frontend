import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'src/app/core/constants/constants';
import { RelatorioMes } from 'src/app/core/models/result';
import { RelatorioService } from 'src/app/core/services/relatorio/relatorio.service';
import { getNameMonth } from 'src/app/core/utils/data';
import { DataBarchart } from 'src/app/shared/components/chart/model/data';

@Component({
  selector: 'app-reporte-mes',
  templateUrl: './reporte-mes.component.html',
  styleUrls: ['./reporte-mes.component.scss'],
})
export class ReporteMesComponent implements OnInit {
  loading: boolean = false;
  data: RelatorioMes[] = [];
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
    this._relatorioService.getRelatorioMes().subscribe(
      (response: any) => {
        this.loading = false;
        this.data = response ?? [];

        this.dataBar = this.data.map((it: RelatorioMes) => {
          this.legendNames.push(getNameMonth(it.relatorioMes));
          return {
            x: it.relatorioValor,
            y: getNameMonth(it.relatorioMes),
          };
        });

        this.dataDonut = this.data.map((it: RelatorioMes, index: number) => {
          return {
            index: it.relatorioMes,
            value: it.relatorioValor,
            color: this.legendColors[index],
            label: getNameMonth(it.relatorioMes),
          };
        });

        this.dataLine = this.data.map((it: RelatorioMes) => {
          return {
            x: it.relatorioValor,
            y: getNameMonth(it.relatorioMes),
            tooltip:
              'Mês: ' +
              getNameMonth(it.relatorioMes) +
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
