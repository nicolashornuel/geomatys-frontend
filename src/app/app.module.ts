import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FileComponent} from './component/file/file.component';
import {HttpClientModule} from '@angular/common/http';
import {StompRService} from '@stomp/ng2-stompjs';
import {WebsocketService} from './service/websocket.service';
import {AlertBarComponent} from './component/alert-bar/alert-bar.component';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from '@stomp/ng2-stompjs';

import {myRxStompConfig} from './my-rx-stomp.config';

@NgModule({
  declarations: [AppComponent, FileComponent, AlertBarComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [
    StompRService,
    WebsocketService,
    AlertBarComponent,
    {
      provide: InjectableRxStompConfig,
      useValue: myRxStompConfig
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
