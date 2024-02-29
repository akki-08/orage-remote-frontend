import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
})
export class ShareComponent {
  @Input() sessionCode: number = 111111;
  sessionIdentifier: number | null = null;

  sessionIdentity: string | null = null;


  setSessionIdentifier(sessionIdentifier: string) {
    this.sessionIdentity = sessionIdentifier;
  }

  getSessionIdentifier(): string {
    if(this.sessionIdentity === null) {
      return "No Value";
    }
    return this.sessionIdentity;
  }

  emailForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.sessionIdentifier = this.sessionCode;

    this.emailForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.sessionCode.toString());
  }

  copyLinkAddress(): void {
    navigator.clipboard.writeText('remote-orage.vercel.app');
  }
}
