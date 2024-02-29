import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreRoutingModule } from './core-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CoreComponent } from './core.component';
import { ConnectComponent } from './connect/connect.component';
import { SettingsComponent } from './settings/settings.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { SessionComponent } from './connect/session/session.component';
import { InstanceComponent } from './connect/instance/instance.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { ChatComponent } from './connect/session/chat/chat.component';
import { ShareComponent } from './connect/session/share/share.component';
import { StatusComponent } from './connect/session/status/status.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatProgressBarModule} from '@angular/material/progress-bar';



@NgModule({
  declarations: [
    CoreComponent,
    ConnectComponent,
    SettingsComponent,
    SessionComponent,
    InstanceComponent,
    ChatComponent,
    ShareComponent,
    StatusComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatSnackBarModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatExpansionModule,
    MatProgressBarModule
  ],
  bootstrap: [CoreComponent],
})
export class CoreModule {}
