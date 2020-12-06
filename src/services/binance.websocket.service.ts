import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs';
const ENDPOINT = environment.websocketEndpoint;

@Injectable({
  providedIn: 'root'
})
export class BinanceWebSocketService {
  public messagesSubject = new Subject();
  private socket: WebSocketSubject<any>;
  private id = 1;
  private subjectName = '!miniTicker@arr';
  private subscribeMethod = 'SUBSCRIBE';
  private unsubscribeMethod = 'UNSUBSCRIBE';

  public connect(): void {
    if (!this.socket || this.socket.closed) {
      this.socket = this.getNewWebSocket();
      this.socket.subscribe(
        event => {
          const data = event.data;
          if (Array.isArray(data)) {
            for (const msg of data) {
              this.messagesSubject.next(msg);
            }
          } else {
            this.messagesSubject.next(data);
          }
        },
        err => console.log(err),
        () => console.log('complete')
      );
      this.socket.next({ method: this.subscribeMethod, params: [this.subjectName], id: this.id });
    }
  }

  private getNewWebSocket(): WebSocketSubject<unknown> {
    return webSocket(ENDPOINT);
  }

  public close(): void {
    this.socket.next({ method: this.unsubscribeMethod, params: [this.subjectName], id: this.id });
    this.socket.closed = true;
  }

  public reconnect(): void {
    this.connect();
  }
}
