import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicPage } from './inic.page';

const routes: Routes = [
  {
    path: '',
    component: InicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicPageRoutingModule {}
