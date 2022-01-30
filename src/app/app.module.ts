import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileComponent } from './component/file/file.component';
import { HttpClientModule } from '@angular/common/http';
import { StompRService } from '@stomp/ng2-stompjs';
import { WebsocketService } from './service/websocket.service';
import { AlertBarComponent } from './component/alert-bar/alert-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    FileComponent,
    AlertBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
    ],
  providers: [StompRService, WebsocketService, AlertBarComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
