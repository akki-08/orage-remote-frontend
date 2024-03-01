import {
  Component,
  ComponentRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InstanceComponent } from './instance/instance.component';
import { SessionComponent } from './session/session.component';
import { HttpClient } from '@angular/common/http';
import { backendUrl, sessionUrl,localUrl } from '../../constants';
import { ShareComponent } from './session/share/share.component';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss'],
})
export class ConnectComponent {
  @ViewChild('sessCont', { read: ViewContainerRef })
  sessContainer!: ViewContainerRef;

  @ViewChild('sessInfo', { read: ViewContainerRef })
  infoContainer!: ViewContainerRef;

  sessions = new Map<string, ComponentRef<any>>();
  sessionIndex: number = 0;

  sessionExists: boolean = false;
  isCreatingSession: boolean = false;

  allSessions: number = 0;
  activeSessions: number = 0;
  // disabledSessions: number = 0;
  currentSession: string = 'null';
  instance: any;
  sessionData: any[]=[];
  // static length:number=0;
  
  ngOnInit(): void {
    this.getSessions().subscribe(
      (data: any) => {
        this.sessionData = data.sessions;
      },
      error => {
        console.error('Error fetching sessions:', error);
      }
    );
  }
  
  getSessions(): Observable<any> {
    return this.http.get<any>(`${localUrl}/getAllSessions`);
  }
  
  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'Close', {
      duration: 3000,
    });
  }

  showSessionInfo(sessionId: string, sessionCode: number): void {
    this.infoContainer.clear();
    const sessionInfo = this.infoContainer.createComponent(SessionComponent);
    sessionInfo.instance.sessionName = sessionId;
    sessionInfo.instance.sessionCode = sessionCode;
  }

  generateRandomCode(length: number): number {
    const randomChars: string = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length),
      );
    }
    return Number(result);
  }

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


  createSession(): void {
    // this.sessionExists = true; // comment it after wards
    let sessionIdentifier = this.randomName();
    let sessionCode = this.generateRandomCode(6);
    this.isCreatingSession = true;
    this.setSessionIdentifier(sessionIdentifier);

   
    console.log("Session code is: "+sessionCode);
    console.log("Session Identifier name is: "+sessionIdentifier);
    
    // console.log("The length of session array is: "+this.sessionData.length);
    this.http
      // .post(`${backendUrl}/0session/createSess`, {
        .post<any>(`${localUrl}/0session/createSess`, {
        code: sessionCode,
        sessionName: sessionIdentifier,
      })
      .subscribe({
        next: (payload: any) => {
          if (payload.sessionExists) {
            if (payload.sessionCodeCreated) {
              this.openSnackBar('Successfully updated the session');
            } else {
              this.openSnackBar('Session not created');
              return;
            }
          } else {
            this.openSnackBar('Session not created');
            return;
          }
        },
        error: (err) => {
          console.log(err);
          this.openSnackBar('Service not available, try again later!');
          return;
        },
      });

    this.http
      // .post<any>(`${sessionUrl}/0session/createSession`, {
        .post<any>(`${localUrl}/0session/createSession`, {
        filename: `${sessionIdentifier}.txt`,
        sessionID: sessionIdentifier,
      })
      .subscribe({
        next: (payload: any) => {
          if (payload.sessionCreated) {
            // main processing goes here
            console.log(payload.sessionCreated);
            this.sessionExists = true;
            const component =
              this.sessContainer.createComponent(InstanceComponent);
            component.instance.sessionName = sessionIdentifier;
            component.instance.sessCode = sessionCode;

            this.sessions.set(sessionIdentifier, component);
            component.instance.deleteComponent.subscribe((event: any) => {
              this.deleteSession(event.sessionName);
            });  

            component.instance.showInfo.subscribe((event: any) => {
              this.showSessionInfo(event.sessionName, event.currentSession);
            });
            this.allSessions++;
            this.isCreatingSession = false;
            // console.log("The length of session array is: "+this.sessionData.length);
            this.openSnackBar(
              `Session ${sessionIdentifier} created successfully`,
            );
          }
        },
        error: (err) => {
          console.error(err);
          this.openSnackBar('Service unavailable, try again after some time');
          this.isCreatingSession = false;
        },
      });
  }


updateSessionData(sessionIdentifier: string, sessionCode: Number): void {
    // Make HTTP request to update session data or perform necessary actions
    this.http.post(`${sessionUrl}/0session/createSession`, {
        filename: `${sessionIdentifier}.txt`,
        sessionID: sessionIdentifier,
    }).subscribe({
        next: (payload: any) => {
            if (payload.sessionCreated) {
                // main processing goes here
                console.log(payload.sessionCreated);
                this.sessionExists = true;
                this.handleSessionComponent(sessionIdentifier,sessionCode);
                this.openSnackBar(`Session ${sessionIdentifier} created successfully`);
            }
        },
        error: (err) => {
            console.error(err);
            this.openSnackBar('Service unavailable, try again after some time');
        },
        complete: () => {
            this.isCreatingSession = false;
        }
    });
}

handleSessionComponent(sessionIdentifier: string, sessionCode: Number): void {
    const existingSessionComponent = this.sessions.get(sessionIdentifier);

    if (existingSessionComponent) {
        // If session component already exists, update its properties
        existingSessionComponent.instance.sessionName = sessionIdentifier;
        existingSessionComponent.instance.sessCode = sessionCode;
    } else {
        // If session component doesn't exist, create a new one
        const component = this.sessContainer.createComponent(InstanceComponent);
        component.instance.sessionName = sessionIdentifier;
        //component.instance.sessCode = sessionCode;

        component.instance.deleteComponent.subscribe((event: any) => {
            this.deleteSession(event.sessionName);
        });

        component.instance.showInfo.subscribe((event: any) => {
            this.showSessionInfo(event.sessionName, event.currentSession);
        });

        this.sessions.set(sessionIdentifier, component);
        this.allSessions++;
    }
}


  deleteSession(sessionName: string): void {
    if (this.sessions.has(sessionName)) {
      this.sessions.get(sessionName)?.destroy();
      this.sessions.delete(sessionName);
      this.allSessions--;
    }

    if (this.sessions.size === 0) {
      this.sessionExists = false;
      this.infoContainer.clear();
    }
  }

  randomString(length: number): string {
    const randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length),
      );
    }
    return result;
  }

  randomName(): string {
    const randomIdeas: string[] = [
      'ashina',
      'sekiro',
      'genichiro',
      'isshin',
      'godfrey',
      'morgott',
      'margit',
      'radahn',
      'godrick',
      'dragon',
      'radagon',
      'midir',
    ];

    let result = `${
      randomIdeas[Math.floor(Math.random() * randomIdeas.length)]
    }-${this.randomString(5)}`;

    return result;
  }
}
