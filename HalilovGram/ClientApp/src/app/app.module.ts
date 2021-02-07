import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { TokenInterceptorService } from './_core/interceptors/token-interceptor.service';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { AuthGuard } from './_core/guards/auth.guard';
import { LoaderComponent } from './_shared/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from './_core/services/loader.service';
import { LoaderInterceptor } from './_core/interceptors/loader.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavMenuComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatProgressSpinnerModule
    
  ],
  providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  },
  AuthGuard,
  LoaderService,
  {
    provide:HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi: true
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
