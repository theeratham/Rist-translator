import { Component, Input } from '@angular/core';
import { Song } from 'src/app/model/app.model';
import { SongPlayerService } from 'src/app/service/song-player/song-player.service';

@Component({
  selector: 'card-play-button',
  templateUrl: './card-play-button.component.html',
  styleUrls: ['./card-play-button.component.css'],
})
export class CardPlayButton {
  @Input() list: Song[] = [];

  constructor(private songPlayerService: SongPlayerService) {}

  ngOnInit(): void {}

  playGivenList() {
    this.songPlayerService.setPlaylist(this.list);
  }
}
