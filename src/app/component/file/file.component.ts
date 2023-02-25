import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Message } from '@stomp/stompjs';
import { take, takeUntil } from 'rxjs/operators';
import { Image } from 'src/app/model/Image.model';
import { Position } from 'src/app/model/Position.model';
import { Size } from 'src/app/model/Size.model';
import { CanvasService } from 'src/app/service/canvas.service';
import { FileService } from 'src/app/service/file.service';
import { WebsocketService } from 'src/app/service/websocket.service';

import { EventBrokerType } from 'src/app/model/EventBrockerType.enum';
import { DestroyService } from 'src/app/service/destroy.service';
import { AlertBarComponent } from '../alert-bar/alert-bar.component';
import {environment} from 'src/environments/environment.prod';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit, AfterViewInit {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('canvasImage') canvasImage!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasCursor') canvasCursor!: ElementRef<HTMLCanvasElement>;
  private ctxImage!: CanvasRenderingContext2D | null;
  private ctxCursor!: CanvasRenderingContext2D | null;
  public file: File | undefined;
  public imageInputFile!: HTMLImageElement;
  public moving: boolean = false;
  public rectIsSet: boolean = false;
  private MAX_WIDTH: number = 500;
  private MAX_HEIGHT: number = 500;
  private ratioWidth: number = 1;
  private ratioHeight: number = 1;
  private position!: Position;
  private size!: Size;
  public imagesSave: any[] = [];
  public navTarget: 'list' | 'doc' = 'list';
  public swaggerUi = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.urlBack}/swagger-ui/index.html`);

  constructor(
    private fileService: FileService,
    private canvasService: CanvasService,
    private sanitizer: DomSanitizer,
    private ws: WebsocketService,
    private alert: AlertBarComponent,
    private destroy$: DestroyService
  ) {}

  /**
   * Initialize a new Image
   *
   * @memberof FileComponent
   */
  ngOnInit(): void {
    this.imageInputFile = new Image();
    this.initializeList();
    this.listenServer();
  }

  /**
   * listen websocket
   *
   * @private
   * @memberof FileComponent
   */
  private listenServer(): void {
    this.ws.onEvent().pipe(takeUntil(this.destroy$)).subscribe((message: Message) => {
      const msg = JSON.parse(message.body);
      if (msg.event === EventBrokerType.CREATE) {
        this.alert.info(`New File uploaded at ${msg.time}`, `File name : ${msg.content}`);
      } else if (msg.event === EventBrokerType.DELETE) {
        this.alert.danger(`New File deleted at ${msg.time}`, `File id : ${msg.content}`);
      }
      this.initializeList()
    });
  }

  /**
   * fetch all files saved to display cards
   *
   * @private
   * @memberof FileComponent
   */
  private initializeList(): void {
    this.fileService.getFiles().pipe(take(1)).subscribe((images: Image[]) => {
      this.imagesSave = [];
      images.forEach((image: Image) => this.pushImg(image));
    });
  }

  /**
   * Initialize canvas context
   *
   * @memberof FileComponent
   */
  ngAfterViewInit(): void {
    this.ctxImage = this.canvasImage.nativeElement.getContext('2d');
    this.ctxCursor = this.canvasCursor.nativeElement.getContext('2d');
  }

  /**
   * Behavior change input type='file'
   *
   * @param {*} e
   * @memberof FileComponent
   */
  public handleFileInput(e: any): void {
    if (e.target.files.length > 0) {
      this.canvasService.clear([this.canvasImage, this.canvasCursor]);
      this.rectIsSet = false;
      const files: FileList = e.target.files;
      this.file = files.item(0)!;
      this.imageInputFile.src = URL.createObjectURL(files[0]);
      this.imageInputFile.onload = () => {
        const size = this.sizeLogic(this.imageInputFile.width, this.imageInputFile.height);
        this.ctxImage!.drawImage(this.imageInputFile, 0, 0, size.w, size.h);
      };
    }
  }

  /**
   * Set size canvas by image ratio
   *
   * @private
   * @param {number} width
   * @param {number} height
   * @return {*}  {*}
   * @memberof FileComponent
   */
  private sizeLogic(width: number, height: number): any {
    this.ratioWidth = 1;
    this.ratioHeight = 1;
    if (width > height) {
      this.ratioHeight = this.MAX_WIDTH / width;
      height = height * this.ratioHeight;
      width = this.MAX_WIDTH;
    } else {
      this.ratioWidth = this.MAX_HEIGHT / height;
      width = width * this.ratioWidth;
      height = this.MAX_HEIGHT;
    }
    this.canvasImage.nativeElement.width = width;
    this.canvasImage.nativeElement.height = height;
    this.canvasCursor.nativeElement.width = width;
    this.canvasCursor.nativeElement.height = height;
    return {
      w: width,
      h: height
    };
  }

  /**
   * onClick DOWN set origin position
   *
   * @param {*} e
   * @memberof FileComponent
   */
  public mousedown(e: any): void {
    this.position = this.canvasService.getCursorPosition(e, this.canvasCursor);
    this.moving = true;
  }

  /**
   * onClick UP rectangle is ready
   *
   * @param {*} e
   * @memberof FileComponent
   */
  public mouseup(e: any): void {
    this.moving = false;
    this.rectIsSet = true;
  }

  /**
   * onMousemove drawn rectangle
   *
   * @param {*} e
   * @memberof FileComponent
   */
  public drawRect(e: any): void {
    if (this.moving) {
      const endPosition: Position = this.canvasService.getCursorPosition(e, this.canvasCursor);
      if (endPosition.x > this.position.x && endPosition.y > this.position.y) {
        this.canvasService.clear([this.canvasCursor]);
        this.size = this.canvasService.getSize(endPosition, this.position);
        this.ctxCursor!.strokeStyle = 'green';
        this.ctxCursor!.strokeRect(this.position.x, this.position.y, this.size.w, this.size.h);
      }
    }
  }

  /**
   * get Ratio image inside canvas
   *
   * @private
   * @return {*}  {number}
   * @memberof FileComponent
   */
  private getRatio(): number {
    return this.ratioWidth === 1 ? 1 / this.ratioHeight : 1 / this.ratioWidth;
  }

  /**
   * onClick crop button
   *
   * @memberof FileComponent
   */
  public crop(): void {
    this.canvasService.clear([this.canvasImage, this.canvasCursor]);
    const ratio = this.getRatio();
    const size: Size = this.sizeLogic(this.size.w * ratio, this.size.h * ratio);
    this.ctxImage!.drawImage(
      this.imageInputFile,
      this.position.x * ratio,
      this.position.y * ratio,
      this.size.w * ratio,
      this.size.h * ratio,
      0,
      0,
      size.w,
      size.h
    );
  }

  /**
   * onClick cancel button
   *
   * @memberof FileComponent
   */
  public cancel(): void {
    this.canvasService.clear([this.canvasCursor]);
    const size = this.sizeLogic(this.imageInputFile.width, this.imageInputFile.height);
    this.ctxImage!.drawImage(this.imageInputFile, 0, 0, size.w, size.h);
    this.rectIsSet = false;
  }

  /**
   * onClick save button
   *
   * @memberof FileComponent
   */
  public save(): void {
    this.canvasImage.nativeElement.toBlob((blob: Blob | null) => {
      this.fileService
        .saveFile(blob!, this.file!.name)
        .pipe(take(1))
        .subscribe((image: Image) => {
          this.ws.onPublish(JSON.stringify({event: EventBrokerType.CREATE, content:image.name}));
          this.input.nativeElement.value = '';
          this.canvasService.clear([this.canvasImage]);
          this.pushImg(image);
        });
    });
  }

  /**
   * insert new Image to display array
   *
   * @private
   * @param {Image} image
   * @memberof FileComponent
   */
  private pushImg(image: Image): void {
    const src: string = 'data:image/png;base64,' + image.data;
    const srcSafe: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(src);
    this.imagesSave.push({
      id: image.id,
      name: image.name,
      src: srcSafe
    });
  }

  /**
   * onClick delete button
   *
   * @param {number} id
   * @memberof FileComponent
   */
  public delete(id: number): void {
    this.fileService
      .deleteFile(id)
      .pipe(take(1))
      .subscribe(() => {
        this.ws.onPublish(JSON.stringify({event: EventBrokerType.DELETE, content:id}));
        this.imagesSave.forEach((image: Image, index: number) => {
          if (image.id === id) this.imagesSave.splice(index, 1);
        });
      });
  }

}
