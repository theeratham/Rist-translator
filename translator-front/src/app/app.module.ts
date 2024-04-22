import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { SearchbarComponent } from './component/search-bar/search-bar.component';
import { UserProfileComponent } from './page/user-profile/user-profile.component';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { PlaylistComponent } from './page/playlist/playlist.component';
import { SongPlayerComponent } from './component/song-player/song-player.component';
import { SongComponent } from './page/song/song.component';
import { AuthGuard } from './guard/auth-guard';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ArtistComponent } from './page/artist/artist.component';
import { AlbumComponent } from './page/album/album.component';
import { SearchComponent } from './page/search/search.component';
import { AlbumRecommendContainer } from './component/album-recommend-container/album-recommend-contianer.component';
import { SongListingContainer } from './component/song-listing-container/song-listing-container.component';
import { SongListingItem } from './component/song-listing-item/song-listing-item.component';
import * as Models from './model/app.model';
import { AlbumRecommendItem } from './component/album-recommend-item/album-recommend-item.component';
import { SearchGroupContainer } from './component/search-group-container/search-group-container.component';
import { ArtistRecommendItem } from './component/artist-recommend-item/artist-recommend-item.component';
import { PlaylistRecommendItem } from './component/playlist-recommend-item/playlist-recommend-item.component';
import { AuthInterceptor } from './interceptor/auth-interceptor.interceptor';
import { LyricsComponent } from './page/lyrics/lyrics.component';
import { PlaylistInfoComponent } from './page/playlist-info/playlist-info.component';
import { PolicyComponent } from './page/policy/policy.component';
import { CardPlayButton } from './component/card-play-button/card-play-button.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SearchbarComponent,
    UserProfileComponent,
    NavBarComponent,
    PlaylistComponent,
    SongPlayerComponent,
    SongComponent,
    ArtistComponent,
    AlbumComponent,
    PlaylistRecommendItem,
    SearchComponent,
    AlbumRecommendContainer,
    ArtistRecommendItem,
    CardPlayButton,
    SearchGroupContainer,
    AlbumRecommendItem,
    SongListingContainer,
    SongListingItem,
    LyricsComponent,
    PlaylistInfoComponent,
    PolicyComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    AppRoutingModule,
    ImageCropperModule,
  ],
  providers: [
    HttpClient,
    // AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
