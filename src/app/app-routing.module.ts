import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileComponent } from './component/file/file.component';

const routes: Routes = [
  { path: "file", component: FileComponent },
  { path: '**' , redirectTo : 'file' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
