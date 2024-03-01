import { HttpClient } from '@angular/common/http';
// const { app, dialog, shell } = require('electron');
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConnectComponent } from '../connect.component';
import { Observable } from 'rxjs';
import { localUrl , sessionUrl , backendUrl } from 'src/app/constants';
// trackByFn(index: number, item: any): number {
//   return item.code; // Use a unique identifier for each session
// }


@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.scss'],
})
export class InstanceComponent implements OnInit {
  @Input() sessionName = 'Unnamed session';
  @Input() sessCode = 0;
  @Output() deleteComponent = new EventEmitter<any>();
  @Output() showInfo = new EventEmitter<any>();
  @ViewChild('session') currentSession!: ElementRef;

  sessionId: string = 'null';
  sessionCode: number | null = null;
  sessionIdentifier: string ='null';
  constructor(
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private connectObj : ConnectComponent,
  ) {}
  sessionData: any[]=[];
  sessionsLoaded: boolean = false;
  ipAddress: string | undefined;

  ngOnInit(): void {
    this.sessionId = this.sessionName;
    this.sessionCode = this.sessCode;
    this.refreshSessionData();
    this.getSessions().subscribe(
      (data: any) => {
        this.sessionData = data.sessions;
      },
      error => {
        console.error('Error fetching sessions:', error);
      }
    );
  }
   
  refreshSessionData(): void {
    this.clearSessionData(); // Clear existing session data
    this.getSessions().subscribe(
      (data: any) => {
        this.sessionData = data.sessions; // Fetch fresh session data
      },
      error => {
        console.error('Error fetching sessions:', error);
      }
    );
  }

  clearSessionData(): void {
    this.sessionData = []; // Clear existing session data
  }

  
  // getSessions(): Observable<any> {
  //   return this.http.get<any>(`${sessionUrl}/getAllSessions`);
  // }
  getSessions(): Observable<any> {
    return this.http.get<any>(`${localUrl}/getAllSessions`);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
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

  deleteSession(sessionName:string): void {
    console.log("My session name is: " + sessionName);

    // Declare ipNumber with a type annotation
    let ipNumber: string;
  
    // Fetch the IP address
    this.getIPAddress().subscribe(
      (data: any) => {
        // Assign the IP address to ipNumber
        ipNumber = data.ip;
  
        // Once IP address is fetched, make the delete request
        this.http.delete<any>(`${sessionUrl}/deleteSession`, { body: { sessionName: sessionName, ipAddress: ipNumber } })
          .subscribe(
            (response) => {
              console.log("Session deleted successfully:", response);
              // Handle any further actions after successful deletion
            },
            (error) => {
              console.error("Error deleting session:", error);
              // Handle error cases
            }
          );
      },
      error => {
        console.error('Error fetching IP address:', error);
      }
    );
  }
  getIPAddress(): Observable<any> {
    return this.http.get<{ ip: string }>(`${sessionUrl}/ip`);
  }

  showSessionInfo(): void {
    this.openSnackBar('SessionInfo clicked', 'ok now close it');
    this.showInfo.emit({
      sessionName: this.sessionId,
      currentSession: this.sessionCode,
    });
    console.log('Session Identifier is using instance is: '+this.sessionName);
  }
  activateSession(): void {
    this.currentSession.nativeElement.style.background = '#86efac';
    this.currentSession.nativeElement.style.outline = 'solid 2px #166534';

    console.log(`I am activated with session code: ${this.sessionCode}`);

    this.download(
      "http://remote.ultimateitsolution.site:5000/0file/downloadHost", this.sessionCode
    );
  }

  download(url: string, random_Code: Number | null) {
    const filename = 'YOUR_FILENAME'; // Provide the filename for the downloaded exe file
    const data = { random_Code, filename };
    this.http.post(url, data, { responseType: 'blob' })
      .subscribe((data: Blob) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const blobUrl = window.URL.createObjectURL(blob);
        console.log(blobUrl);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${filename}.exe`; // Set the desired file name with .exe extension
        a.addEventListener('click', () => {
          // Perform your action here when the file is clicked
          console.log('Executable file clicked!');
          console.log(data);
        });
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      });
  }
  
  

  deactivateSession(): void {
    this.currentSession.nativeElement.style.background = '#e5e5e5';
    this.currentSession.nativeElement.style.outline = 'none';
  }

  downloadSystemConfig(sessionN:string): void {
    const seesionId = sessionN;
    const backendUrl =`http://localhost:5000/generateSystemConfig?customVariable=${seesionId}`; // Replace with your backend URL


    console.log('Session Identifier in system configuration is: '+this.sessionName);
    
    // const backendUrl ="http://localhost:5000/generateSystemConfig?sessionId=${sessionId}";

    this.http.get(backendUrl, { responseType: 'blob' })
    .subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement('a');
      a.href = url;
      a.download = 'system-config.exe'; // Name your executable file
      
      document.body.appendChild(a);
      
      // Simulate click
      a.click();
  
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
    console.log('================================');
  }

downloadSystemConfiguration(sessionN:string , IpAddress :string): void {
  const seesionId = sessionN,sessionIP=IpAddress;
  // const backendUrl =`http://localhost:5000/generateSystemConfiguration?customVariable=${seesionId}&IPAddress=${sessionIP}`; // Replace with your backend URL
  // const backendUrl =`${sessionUrl}/generateSystemConfiguration?customVariable=${seesionId}&IPAddress=${sessionIP}`;
  const backendUrl =`${localUrl}/generateSystemConfiguration?customVariable=${seesionId}&IPAddress=${sessionIP}`;

  console.log('Session Identifier in system configuration is: '+this.sessionName);
  
  // const backendUrl ="http://localhost:5000/generateSystemConfig?sessionId=${sessionId}";

  this.http.get(backendUrl, { responseType: 'blob' })
  .subscribe((blob: Blob) => {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'system-config.exe'; // Name your executable file
    
    document.body.appendChild(a);
    
    // Simulate click
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });
  console.log('================================');
}

}

