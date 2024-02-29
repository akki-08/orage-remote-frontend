import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from 'src/app/constants';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  logginIn: boolean = false;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern(
            /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/,
          ),
        ],
      ],
      password: [null, [Validators.required, Validators.minLength(6)]],
      remember: false,
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  async onSubmit() {
    this.logginIn = true;
    this.http
      .post(`${backendUrl}/0auth/login`, this.loginForm.getRawValue(), {
        withCredentials: true,
      })
      .subscribe({
        next: (resp: any) => {
          if (resp.userExists) {
            if (resp.userVerified) {
              if (resp.isPasswordTrue) {
                if (this.loginForm.controls['remember'].value) {
                  console.log(this.loginForm.controls['remember'].value);
                  AuthInterceptor.accessToken = resp.accessToken;
                  this.router.navigate(['']);
                  this.logginIn = false;
                } else {
                  console.log(this.loginForm.controls['remember'].value);
                  sessionStorage.setItem('accessToken', resp.accessToken);
                  AuthInterceptor.accessToken = resp.accessToken;
                  this.router.navigate(['']);
                  this.logginIn = false;
                }
              } else {
                this.openSnackBar('Wrong email or password', 'Close');
                this.logginIn = false;
              }
            } else {
              this.openSnackBar(
                'User not verified, verify your email first',
                'Close',
              );
              this.logginIn = false;
            }
          } else {
            this.openSnackBar('User does not exists', 'Close');
            this.logginIn = false;
          }
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar(
            'Some error occured, please try again later',
            'close',
          );
          this.logginIn = false;
        },
      });
  }

  isLoading(): void {
    setTimeout(() => {
      this.logginIn = true;
    }, 1000);
  }

  doneLoading(): void {
    this.logginIn = false;
  }

  getEmailError() {
    if (this.loginForm.controls['email'].hasError('required')) {
      return 'You must enter a value';
    }

    if (this.loginForm.controls['email'].hasError('email')) {
      return 'Enter a valid email address';
    }

    return '';
  }

  getPasswordError() {
    if (this.loginForm.controls['password'].hasError('required')) {
      return 'You must enter the password';
    }

    if (this.loginForm.controls['password'].hasError('minlength')) {
      return 'Password should be minimum 6 characters long';
    }

    return '';
  }
}
