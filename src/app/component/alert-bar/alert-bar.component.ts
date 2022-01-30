import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-alert-bar',
  templateUrl: './alert-bar.component.html',
  styleUrls: ['./alert-bar.component.scss']
})
export class AlertBarComponent implements OnInit {
  private classPrimary: string = 'alert alert-primary';
  private classSecondary: string = 'alert alert-secondary';
  private classSuccess: string = 'alert alert-success';
  private classDanger: string = 'alert alert-danger';
  private classWarning: string = 'alert alert-warning';
  private classInfo: string = 'alert alert-info';
  private styleBar: string = 'box-shadow: 0 0 8px 0px hsl(0deg 0% 50% / 47%); cursor: pointer;'
  constructor() {}

  ngOnInit(): void {}

  public primary(title: string, content: string) {
    this.createAlert(title, content, this.classPrimary);
  }

  public secondary(title: string, content: string) {
    this.createAlert(title, content, this.classSecondary);
  }

  public success(title: string, content: string) {
    this.createAlert(title, content, this.classSuccess);
  }

  public danger(title: string, content: string) {
    this.createAlert(title, content, this.classDanger);
  }

  public warning(title: string, content: string) {
    this.createAlert(title, content, this.classWarning);
  }

  public info(title: string, content: string) {
    this.createAlert(title, content, this.classInfo);
  }

  private createAlert(title: string, content: string, classBt: string) {
    let element = document.createElement('div');
    document.getElementById('insert')!.appendChild(element);
    element.setAttribute('class', classBt);
    element.setAttribute('style', this.styleBar);
    let titleElt = document.createElement('p');
    titleElt.textContent = title;
    element.appendChild(titleElt);
    titleElt.setAttribute('class', 'font-weight-bold m-0');
    let nameFileElt = document.createElement('p');
    nameFileElt.textContent = content;
    element.appendChild(nameFileElt);
    nameFileElt.setAttribute('class', 'font-weight-light m-0');
    element.addEventListener('click', () => {
      element.setAttribute('style', 'display:none;');
    });
  }
}
