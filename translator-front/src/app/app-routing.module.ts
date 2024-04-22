import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { HomeComponent } from './page/home/home.component';
import { PlaylistComponent } from './page/playlist/playlist.component';
import { UserProfileComponent } from './page/user-profile/user-profile.component';
import { SongComponent } from './page/song/song.component';
import { AuthGuard } from './guard/auth-guard';
import { SearchComponent } from './page/search/search.component';
import { ArtistComponent } from './page/artist/artist.component';
import { AlbumComponent } from './page/album/album.component';
import { LyricsComponent } from './page/lyrics/lyrics.component';
import { PlaylistInfoComponent } from './page/playlist-info/playlist-info.component';
import { PolicyComponent } from './page/policy/policy.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'policy',
    component: PolicyComponent,
  },
  {
    path: 'album/:album_id',
    component: AlbumComponent,
  },
  {
    path: 'artist/:artist_id',
    component: ArtistComponent,
  },
  {
    path: 'album',
    component: AlbumComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'playlist',
    component: PlaylistComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'playlist/:playlist_id',
    component: PlaylistInfoComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'song',
    component: SongComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'lyrics',
    component: LyricsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
