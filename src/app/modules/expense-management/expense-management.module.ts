import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseManagementRoutingModule } from './expense-management-routing.module';
import { SearchComponent } from './views/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgBootstrapModule } from 'src/app/bootstrap/bootstrap.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableMovimentacaoComponent } from './components/table-movimentacao/table-movimentacao.component';
import { ReporteMesComponent } from './views/reporte-mes/reporte-mes.component';
import { ReporteCategoriaComponent } from './views/reporte-categoria/reporte-categoria.component';
import { ReporteFonteComponent } from './views/reporte-fonte/reporte-fonte.component';

@NgModule({
  declarations: [
    SearchComponent,
    TableMovimentacaoComponent,
    ReporteMesComponent,
    ReporteCategoriaComponent,
    ReporteFonteComponent,
  ],
  imports: [
    CommonModule,
    ExpenseManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgBootstrapModule,
    NgSelectModule,
    NgbModule,
  ],
})
export class ExpenseManagementModule {}
