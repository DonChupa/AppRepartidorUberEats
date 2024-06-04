import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicPageRoutingModule } from './inic-routing.module';

import { InicPage } from './inic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicPageRoutingModule
  ],
  declarations: [InicPage]
})
export class InicPageModule {}
