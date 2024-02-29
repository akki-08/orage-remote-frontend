import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent {
  @Input() sessionName: string = 'null';

  hostStatus: boolean = false;
  clientStatus: boolean = false;
  sessionDuration: string = '-';
}
