import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection!: HubConnection;
  private notificationSubject = new Subject<string>();
  notifications$ = this.notificationSubject.asObservable();

  constructor(private authService: AuthService) {
    this.initializeConnection();
  }

  private initializeConnection() {
    const token = this.authService.getToken();

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/library`, {
        headers: { "Authorization": `Bearer ${token}` },
        accessTokenFactory: () => token ?? ''
      })
      .withAutomaticReconnect()
      .build();

    this.startConnection();

    this.hubConnection.on('ReceiveNotification', (message: string) => {
      this.notificationSubject.next(message);
    });
  }

  private async startConnection() {
    try {
      await this.hubConnection.start();
      console.log('SignalR connection started successfully');
    } catch (err) {
      console.error('Error while starting SignalR connection:', err);
      // Retry connection after a delay
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  // Cleanup method
  public disconnect() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }
}
