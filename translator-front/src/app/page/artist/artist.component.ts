import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Album, Artist, Song } from 'src/app/model/app.model';
import { AlbumService } from 'src/app/service/album/album.service';
import { ArtistService } from 'src/app/service/artist/artist.service';
import { SongPlayerService } from 'src/app/service/song-player/song-player.service';
import { SongService } from 'src/app/service/song/song.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
})
export class ArtistComponent implements OnInit {
  artistId: number = -1;
  artist?: Artist;
  albums: Album[] = [];
  songs: Song[] = [];
  constructor(
    public route: ActivatedRoute,
    private artistService: ArtistService,
    private albumService: AlbumService,
    private songService: SongService,
    private songPlayerService: SongPlayerService
  ) {
    route.params.subscribe((params) => {
      this.artistId = params['artist_id'];
      this.artistService.getArtistById(this.artistId).subscribe((data) => {
        this.artist = data.data;
        console.log(this.artist);
      });
      this.songService.getSongsByArtistId(this.artistId).subscribe((data) => {
        this.songs = data.data;
        console.log(this.songs);
      });
      this.albumService.getAlbumByArtist(this.artistId).subscribe((data) => {
        this.albums = data.data;
        console.log(this.albums);
      });
    });
  }

  handleSongListPlayEvent(from: number = 0) {
    const playingSongs = this.songs.slice(from);
    this.songPlayerService.setPlaylist(playingSongs);
  }

  ngOnInit(): void {}
}
