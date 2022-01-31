import {Injectable} from '@angular/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private rxStompService: RxStompService) {}

  onEvent(): Observable<Message> {
    return this.rxStompService.watch('/topic/image')
  }

  onPublish(message: string) {
    this.rxStompService.publish({ destination: '/app/image', body: message });
  }

}
