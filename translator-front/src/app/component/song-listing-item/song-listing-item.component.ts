import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { Song } from 'src/app/model/app.model';

@Component({
  selector: 'song-listing-item',
  templateUrl: './song-listing-item.component.html',
  styleUrls: ['./song-listing-item.component.css'],
})
export class SongListingItem implements OnInit {
  @Input() song: Song = {} as Song;
  @Input() index?: number;
  @Output() playButtonPressedEvent = new EventEmitter<void>();
  songName: string = '';
  songImageSrc: string = '';

  songDuration: number = 0;
  artistName?: string;
  artistLink?: string = '';
  songDurationText: string = '';
  ngOnInit(): void {
    this.songName = this.song.name;
    this.songImageSrc = this.song.picturePath;
    this.songDuration = this.song.duration;
    this.artistName = this.song.artist.name;
    this.artistLink = `/artist/${this.song.artist.id}`;

    this.songDurationText = `${Math.floor(this.songDuration / 60)
      .toString()
      .padStart(1, '0')}:${(this.songDuration % 60)
      .toString()
      .padStart(2, '0')}`;
  }

  playButtonPressed() {
    console.log('aodsjfo');
    this.playButtonPressedEvent.emit();
  }
}
