import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album, Artist, Song } from 'src/app/model/app.model';
import { AlbumService } from 'src/app/service/album/album.service';
import { ArtistService } from 'src/app/service/artist/artist.service';
import { SongPlayerService } from 'src/app/service/song-player/song-player.service';
import { SongService } from 'src/app/service/song/song.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent implements OnInit {
  albumId: number = -1;
  artist?: Artist;
  songs: Song[] = [];
  album?: Album;
  constructor(
    public route: ActivatedRoute,
    private artistService: ArtistService,
    private albumService: AlbumService,
    private songService: SongService,
    private songPlayerService: SongPlayerService
  ) {
    route.params.subscribe((params) => {
      this.albumId = params['album_id'];
      this.albumService.getAlbumId(this.albumId).subscribe((data) => {
        this.album = data.data;
        console.log(this.album);
        this.artistService.getArtistById(this.album!.id!).subscribe((data) => {
          this.artist = data.data;
        });
      });
      this.songService.getSongsByAlbumId(this.albumId).subscribe((data) => {
        this.songs = data.data;
      });
    });
  }

  handleSongListPlayEvent(from: number = 0) {
    const playingSongs = this.songs.slice(from);
    this.songPlayerService.setPlaylist(playingSongs);
  }

  ngOnInit(): void {}
}
