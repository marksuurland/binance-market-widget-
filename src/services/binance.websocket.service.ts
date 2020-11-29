import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs';
const ENDPOINT = environment.websocketEndpoint;

@Injectable({
    providedIn: 'root'
})
export class BinanceWebSocketService {
    private socket: WebSocketSubject<any>;
    public messagesSubject = new Subject();

    public connect(): void {
        if (!this.socket || this.socket.closed) {
            this.socket = this.getNewWebSocket();
            this.socket.subscribe((event: any) => {
                const data = event.data;
                if (Array.isArray(data)) {
                  for (const msg of data) {
                    this.messagesSubject.next(msg);
                  }
                } else {
                  this.messagesSubject.next(data);
                }
            });
        }
    }

    private getNewWebSocket(): WebSocketSubject<unknown> {
      return webSocket(ENDPOINT);
    }

    public close(): void {
        this.socket.complete();
    }
}
