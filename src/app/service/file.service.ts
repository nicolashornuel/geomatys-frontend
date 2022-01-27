import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { Image} from 'src/app/model/Image.model';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private URL_BACKEND: string = environment.urlBack;

  constructor(private http: HttpClient, private wsService: WebsocketService) {}

  /**
   * CREATE ONE
   *
   * @param {Blob} blob
   * @param {string} fileName
   * @return {*}  {Observable<Image>}
   * @memberof FileService
   */
  public saveFile(blob: Blob, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', blob, fileName);
    this.wsService.onPublish(fileName);
    return this.http.post<Image>(`${this.URL_BACKEND}/uploadFile`, formData);
  }

  /**
   * READ ALL
   *
   * @return {*}  {Observable<Image[]>}
   * @memberof FileService
   */
  public getFiles(): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.URL_BACKEND}/liste`);
  }
}
