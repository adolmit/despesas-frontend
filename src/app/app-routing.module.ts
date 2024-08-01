import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CONSTANTS } from './core/constants/constants';

const routes: Routes = [
  { path: '', redirectTo: '/expense-management', pathMatch: 'full' },
  {
    path: CONSTANTS.EXPENSE_MANAGEMENT_ROUTE.path,
    loadChildren: () =>
      import('./modules/expense-management/expense-management.module').then(
        (m) => m.ExpenseManagementModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
