import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from './pipes/truncate.pipe';
import { LoaderComponent } from './loader/loader.component';
import { TimePassedPipe } from './pipes/time-passed.pipe';



@NgModule({
  declarations: [TruncatePipe,LoaderComponent, TimePassedPipe],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
