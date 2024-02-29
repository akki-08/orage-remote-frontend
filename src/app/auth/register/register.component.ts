import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { backendUrl } from 'src/app/constants';
import { HttpClient } from '@angular/common/http';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  logginUp: boolean = false;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/
          ),
        ],
      ],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirm: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
  async onSubmit() {
    this.logginUp = true;

    this.http
      .post(`${backendUrl}/0auth/register`, {
        email: this.registerForm.controls['email'].value,
        password: this.registerForm.controls['password'].value,
      })
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          if (!resp.userVerified) {
            if (resp.uid) {
              this.logginUp = false;
              this.router.navigate(['/auth/otp', resp.uid]);
            } else {
              this.openSnackBar(
                'Some error occured, try again after some time',
                'Close'
              );
              this.logginUp = false;
            }
          } else {
            this.openSnackBar(
              'User already exists, try signing up with a different account',
              'Close'
            );
            this.logginUp = false;
          }
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar(
            'Some error occured, try again after some time',
            'Close'
          );
          this.logginUp = false;
        },
      });
  }

  getEmailError() {
    if (this.registerForm.controls['email'].hasError('required')) {
      return 'You must enter a value';
    }

    if (this.registerForm.controls['email'].hasError('email')) {
      return 'Enter a valid email address';
    }

    return '';
  }

  getPasswordError() {
    if (this.registerForm.controls['password'].hasError('required')) {
      return 'You must enter the password';
    }

    if (this.registerForm.controls['password'].hasError('minlength')) {
      return 'Password should be minimum 8 characters long';
    }

    return '';
  }

  getConfirmError() {
    if (this.registerForm.controls['password'].hasError('required')) {
      return 'You must enter the password';
    }

    if (
      this.registerForm.controls['password'] !=
      this.registerForm.controls['confirm']
    ) {
      return 'Password does not match';
    }

    return '';
  }
}
