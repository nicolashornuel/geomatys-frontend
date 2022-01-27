import {Injectable} from '@angular/core';
import {StompRService, StompConfig} from '@stomp/ng2-stompjs';
import * as SockJS from 'sockjs-client';
import {Message} from '@stomp/stompjs';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment.prod';
import { Image} from 'src/app/model/Image.model';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private URL_BACKEND: string = environment.urlBack;

  constructor(private stompService: StompRService) {}

  private init(): void {
    if (!this.stompService.connected()) {
      this.stompService.config = this.stompConfig();
      this.stompService.initAndConnect();
    }
  }


  onEvent(): Observable<Message> {
    this.init();
    return this.stompService.subscribe('/topic/uploadFile');
  }

  onPublish(message: string) {
    this.stompService.publish('/app/uploadFile',message); // /app/stomp  /app/uploadFile
  }


  private stompConfig(): StompConfig {
    const provider = () => {
      return new SockJS(`${this.URL_BACKEND}/stomp`);
    };
    const config = new StompConfig();

    config.url = provider;
    config.heartbeat_in = 0;
    config.heartbeat_out = 0;
    config.reconnect_delay = 10000;

    return config;
  }
}
