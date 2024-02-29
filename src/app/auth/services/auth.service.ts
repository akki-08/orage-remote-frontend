import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

import { loginPayload } from './interfaces/loginPayload';
import { registerPayload } from './interfaces/registerPayload';
import { otpPayload } from './interfaces/otpPayload';
import { logoutPayload } from './interfaces/logoutPayload';
import { forgotPassPaylaod } from './interfaces/forgotPassPayload';
import { backendUrl } from 'src/app/constants';

import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';

import { loginResp } from './respInterfaces/loginResp';
import { regResp } from './respInterfaces/registerResp';
import { otpResp } from './respInterfaces/otpResp';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  login(loginPayload: loginPayload): boolean {
    let response = false;
    this.http.post(`${backendUrl}/0auth/login`, loginPayload).subscribe({
      next: (resp: loginResp) => {
        if (resp.userExists) {
          if (resp.userVerified) {
            if (resp.isPasswordTrue) {
              AuthInterceptor.accessToken = resp.accessToken;
              response = true;
            } else {
              this.openSnackBar('Wrong email or password', 'Close');
            }
          } else {
            this.openSnackBar(
              'User not verified, verify your email first',
              'Close'
            );
          }
        } else {
          this.openSnackBar('User does not exists', 'Close');
        }
      },
      error: (err) => {
        console.error(err);
        this.openSnackBar(
          'Some error occured, please try again later',
          'close'
        );
      },
    });
    return response;
  }

  register(registerPayload: registerPayload): {
    registered: boolean;
    uid: string;
  } {
    let response: boolean = false;
    let userId: string = '';
    this.http.post(`${backendUrl}/0auth/register`, registerPayload).subscribe({
      next: (resp: regResp) => {
        console.log(resp);
        if (!resp.userVerified) {
          if (resp.uid) {
            response = true;
            userId = resp.uid;
          } else {
            this.openSnackBar(
              'Some error occured, try again after some time',
              'Close'
            );
          }
        } else {
          this.openSnackBar(
            'User already exists, try signing up with a different account',
            'Close'
          );
        }
      },
      error: (err) => {
        console.error(err);
        this.openSnackBar(
          'Some error occured, try again after some time',
          'Close'
        );
      },
    });
    return {
      registered: response,
      uid: userId,
    };
  }

  verifyOtp(otpPayload: otpPayload): boolean {
    let response: boolean = false;
    this.http.post(`${backendUrl}/0auth/verifyOtp`, otpPayload).subscribe({
      next: (resp: otpResp) => {
        if (resp.otpValid) {
          if (!resp.otpExpired) {
            response = true;
          } else {
            this.openSnackBar(
              'Otp expired, click on resend otp to generate a new otp',
              'Close'
            );
          }
        } else {
          this.openSnackBar('Please enter a 6 digit otp', 'Close');
        }
      },
      error: (err) => {
        console.error(err);
        this.openSnackBar(
          'Some error occured, please try again after some time',
          'Close'
        );
      },
    });
    return response;
  }

  resendOtp(resendOtpPayload: any) {}

  forgotPass(forgotPassPayload: forgotPassPaylaod) {}

  logout(logoutPayload: logoutPayload) {}
}
