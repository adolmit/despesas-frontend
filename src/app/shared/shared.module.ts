import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './components/chart/bar-chart/bar-chart.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableFooterPaginationComponent } from './components/table-footer-pagination/table-footer-pagination.component';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { TopBarComponent } from './components/topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { DonutChartComponent } from './components/chart/donut-chart/donut-chart.component';
import { LineChartComponent } from './components/chart/line-chart/line-chart.component';

@NgModule({
  declarations: [
    BarChartComponent,
    TableFooterPaginationComponent,
    BreadcrumbsComponent,
    TopBarComponent,
    DonutChartComponent,
    LineChartComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    NgbPaginationModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    BarChartComponent,
    TableFooterPaginationComponent,
    BreadcrumbsComponent,
    TopBarComponent,
    DonutChartComponent,
    LineChartComponent,
  ],
})
export class SharedModule {}
