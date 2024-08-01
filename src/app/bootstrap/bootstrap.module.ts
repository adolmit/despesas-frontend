import { NgModule } from '@angular/core';
import {
  NgbAccordionModule,
  NgbDatepickerModule,
  NgbModalModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbToastModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  exports: [
    NgbDatepickerModule,
    NgbAccordionModule,
    NgbTooltipModule,
    NgbNavModule,
    NgbModalModule,
    NgSelectModule,
    NgbPaginationModule,
    NgbToastModule,
  ],
  providers: [],
})
export class NgBootstrapModule {}
