import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DataResult } from '../models/result';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  path: string = 'http://dados.recife.pe.gov.br/api/3/action/datastore_search';
  constructor(private http: HttpClient) {}

  getData(offset: number, limit: number): Observable<DataResult> {
    let params = new HttpParams();
    params = params.append(
      'resource_id',
      'd4d8a7f0-d4be-4397-b950-f0c991438111'
    );
    params = params.append('limit', limit);
    params = params.append('offset', offset);

    return this.http
      .get<DataResult>(this.path, { params })
      .pipe(map((items: any) => items.result));
  }
}
