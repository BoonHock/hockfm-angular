import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/material/material.module';

import { AppComponent } from './app.component';

import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { YtPlayerComponent } from './audio-player/yt-player.component';
import { HomeComponent } from './home/home.component';
import { PodcastDetailComponent } from './podcasts/podcast-detail.component';
import { ConvertDbDatePipe } from './shared/pipes/convert-db-date.pipe';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    AudioPlayerComponent,
    PodcastDetailComponent,
    HomeComponent,
    SidenavComponent,
    ToolbarComponent,
    ConvertDbDatePipe,
    YtPlayerComponent,
    SubscriptionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
