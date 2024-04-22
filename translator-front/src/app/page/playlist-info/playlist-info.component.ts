import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Playlist } from 'src/app/model/app.model';
import { PlaylistService } from 'src/app/service/playlist/playlist.service';
import { SongPlayerService } from 'src/app/service/song-player/song-player.service';

@Component({
  selector: 'app-playlist-info',
  templateUrl: './playlist-info.component.html',
  styleUrls: ['./playlist-info.component.css'],
})
export class PlaylistInfoComponent implements OnInit {
  playlistId: number = -1;
  playlist?: Playlist;

  constructor(
    private playlistService: PlaylistService,
    private route: ActivatedRoute,
    private songPlayerService: SongPlayerService
  ) {}

  get playlistImage() {
    return this.playlist?.songs[0].picturePath;
  }

  handleSongListPlayEvent(from: number = 0) {
    console.log('ajiosddsfjoi');
    if (!this.playlist?.songs) {
      return;
    }
    const playingSongs = this.playlist.songs.slice(from);
    this.songPlayerService.setPlaylist(playingSongs);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.playlistId = params['playlist_id'];
      this.loadPlaylist(this.playlistId);
    });
  }

  loadPlaylist(playlistId: number) {
    this.playlistService.getPlaylistById(playlistId).subscribe((data) => {
      this.playlist = data.data;
      console.log(this.playlist);
    });
  }
}
