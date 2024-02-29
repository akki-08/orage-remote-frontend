import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core.component';
import { SettingsComponent } from './settings/settings.component';
import { ConnectComponent } from './connect/connect.component';

const routes: Routes = [
  {
    path: 'home',
    component: CoreComponent,
    children: [
      {
        path: '',
        component: ConnectComponent,
      },
      {
        path: 'options',
        component: SettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
