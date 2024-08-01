import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  RelatorioCategoria,
  RelatorioFonte,
  RelatorioMes,
} from '../../models/result';

@Injectable({
  providedIn: 'root',
})
export class RelatorioService {
  private url = environment.urlRest + 'relatorios';

  constructor(private http: HttpClient) {}

  getRelatorioMes(): Observable<RelatorioMes[]> {
    return this.http.get<RelatorioMes[]>(this.url + '/mes');
  }

  getRelatorioCategoria(): Observable<RelatorioCategoria[]> {
    return this.http.get<RelatorioCategoria[]>(this.url + '/categoria');
  }

  getRelatorioFonte(): Observable<RelatorioFonte[]> {
    return this.http.get<RelatorioFonte[]>(this.url + '/fonte');
  }
}
