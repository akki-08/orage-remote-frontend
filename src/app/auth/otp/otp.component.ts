import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { backendUrl } from 'src/app/constants';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  otpForm!: FormGroup;
  verifying: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: [null, Validators.required],
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
  onOtpChange(e: any) {
    this.otpForm.patchValue({
      otp: e,
    });
  }

  async onSubmit() {
    this.verifying = true;
    this.http
      .post(`${backendUrl}/0auth/verifyOtp`, {
        otp: this.otpForm.controls['otp'].value,
        userId: this.activatedRoute.snapshot.paramMap.get('uid'),
      })
      .subscribe({
        next: (resp: any) => {
          if (resp.otpValid) {
            if (!resp.otpExpired) {
              this.router.navigate(['/auth/login']);
            } else {
              this.openSnackBar(
                'Otp expired, click on resend otp to generate a new otp',
                'Close'
              );
              this.verifying = false;
            }
          } else {
            this.openSnackBar('Please enter a 6 digit otp', 'Close');
            this.verifying = false;
          }
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar(
            'Some error occured, please try again after some time',
            'Close'
          );
          this.verifying = false;
        },
      });
  }

  isLoading(): void {
    setTimeout(() => {
      this.verifying = true;
    }, 1000);
  }

  doneLoading(): void {
    this.verifying = false;
  }
}
