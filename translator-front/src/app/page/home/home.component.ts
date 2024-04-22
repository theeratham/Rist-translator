import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Album, Artist, TokenPayload } from 'src/app/model/app.model';
import { AlbumService } from 'src/app/service/album/album.service';
import { ArtistService } from 'src/app/service/artist/artist.service';
import { SongService } from 'src/app/service/song/song.service';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: TokenPayload;
  albums: Album[] = [];
  artists: Artist[] = [];

  constructor(
    private userService: UserService,
    private songService: SongService,
    private albumService: AlbumService,
    private artistService: ArtistService
  ) {
    this.user = userService.getTokenPayload();
  }

  ngOnInit(): void {
    this.artistService.getAllArtist().subscribe((data) => {
      this.artists = data.data;
    });
    this.albumService.getAllAlbum().subscribe((data) => {
      this.albums = data.data;
    });
  }

  onSearchInput(input: string) {
    this.songService.search(input).subscribe((data) => {
      // this.searchResult = data;
    });
  }
}
