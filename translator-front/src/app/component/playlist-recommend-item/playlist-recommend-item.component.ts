import { Component, Input, OnInit } from '@angular/core';
import { Album, Playlist, Song, UserInfo } from 'src/app/model/app.model';

@Component({
  selector: 'playlist-recommend-item',
  templateUrl: './playlist-recommend-item.component.html',
  styleUrls: ['./playlist-recommend-item.component.css'],
})
export class PlaylistRecommendItem implements OnInit {
  @Input() playlist: Playlist = {} as Playlist;
  playlistName: string = '';
  playlistHref: string = '';
  playlistImageSrc: string = '';
  user: UserInfo = {} as UserInfo;
  songs: Song[] = [];
  afadsf() {}
  ngOnInit(): void {
    this.playlistName = this.playlist.name;
    this.playlistHref = `/playlist/${this.playlist.id}`;
    this.user = this.playlist.user;
    this.songs = this.playlist.songs;
    if (this.playlist.songs.length > 0) {
      this.playlistImageSrc = this.playlist.songs[0].picturePath;
    } else {
      this.playlistImageSrc =
        'https://www.rawckus.com/wp-content/uploads/2017/02/playlists-.jpg';
    }
  }
}
