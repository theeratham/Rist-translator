import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { Album, Song } from 'src/app/model/app.model';
import { AlbumService } from 'src/app/service/album/album.service';
import { SongService } from 'src/app/service/song/song.service';

@Component({
  selector: 'album-recommend-item',
  templateUrl: './album-recommend-item.component.html',
  styleUrls: ['./album-recommend-item.component.css'],
})
export class AlbumRecommendItem implements OnInit {
  @Input() album: Album = {} as Album;
  albumName: string = '';
  albumHref: string = '';
  albumImageSrc: string = '';
  artistName: string = '';
  artistLink: string = '';
  releasedYear: string = '';
  songs: Song[] = [];

  constructor(
    private albumService: AlbumService,
    private songService: SongService
  ) {}
  ngOnInit(): void {
    this.albumName = this.album.name;
    this.albumHref = `/album/${this.album.id}`;
    this.albumImageSrc = this.album.picturePath;
    this.releasedYear = this.album.released_year;
    this.songService.getSongsByAlbumId(this.album.id).subscribe((data) => {
      this.songs = data.data;
    });
  }
}
