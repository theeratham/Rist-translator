import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Artist, Song } from 'src/app/model/app.model';
import { SongService } from 'src/app/service/song/song.service';

@Component({
  selector: 'artist-recommend-item',
  templateUrl: './artist-recommend-item.component.html',
  styleUrls: ['./artist-recommend-item.component.css'],
})
export class ArtistRecommendItem implements OnInit {
  @Input() artist: Artist = {} as Artist;
  artistName: string = '';
  artistLink: string = '';
  artistImageSrc: string = '';
  songs: Song[] = [];

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.artistName = this.artist.name;
    this.artistLink = `/artist/${this.artist.id}`;
    this.artistImageSrc = this.artist.picturePath;
    this.songService.getSongsByArtistId(this.artist.id).subscribe((data) => {
      this.songs = data.data;
      console.log(this.songs);
    });
  }
}
