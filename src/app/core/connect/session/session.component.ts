import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent implements OnInit {
  @Input() sessionName = 'sessionName';
  @Input() sessionCode = 111111;

  sessName: string = 'null';
  sessionId: number = 111111;

  ngOnInit(): void {
    this.sessionId = this.sessionCode;
    this.sessName = this.sessionName;
  }
}
