import {ElementRef, Injectable} from '@angular/core';
import {Position} from '../model/Position.model';
import {Size} from '../model/Size.model';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {



  constructor() {}

  public getCursorPosition(event: any, canvas: ElementRef<HTMLCanvasElement>): Position {
    const rect = canvas.nativeElement.getBoundingClientRect();
    const cursorPosition: Position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    return cursorPosition;
  }

  public getSize(endPosition: Position, startPosition: Position): Size {
    const size: Size = {
      w: endPosition.x - startPosition.x,
      h: endPosition.y - startPosition.y,
    }
    return size;
  }


  public clear(elements: ElementRef<HTMLCanvasElement>[]): void {
    elements.forEach((element: ElementRef<HTMLCanvasElement>) => {
      const canvas: HTMLCanvasElement = element.nativeElement;
      const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
    });
  }
  

}
