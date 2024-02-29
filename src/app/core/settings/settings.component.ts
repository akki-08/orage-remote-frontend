import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  panelOpenState = false;
  emailConfigForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.emailConfigForm = this.fb.group({
      subject: ['Invitation to join OrageKonnekt session'],
      body: [
        'A session is hosted by the sender of this email, and you can join the given session by clicking on the below link and inserting the session code ( as instructed by the client )',
      ],
    });
  }
}
