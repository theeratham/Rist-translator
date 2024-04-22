import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Lyrics,
  SyncedLyrics,
  SyncedLyricsPair,
} from 'src/app/model/app.model';
import { AlbumService } from 'src/app/service/album/album.service';
import { LyricsService } from 'src/app/service/lyrics/lyrics.service';
import { SongPlayerService } from 'src/app/service/song-player/song-player.service';
import { SongService } from 'src/app/service/song/song.service';

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.component.html',
  styleUrls: ['./lyrics.component.css'],
})
export class LyricsComponent implements OnInit {
  lyricsPaired: {
    original: SyncedLyrics['lyric_lines'][number];
    translated: SyncedLyrics['lyric_lines'][number];
  }[] = [];
  currentTime: number = 0;
  constructor(
    private lyricsService: LyricsService,
    private songService: SongService,
    private songPlayerService: SongPlayerService,
    private albumService: AlbumService
  ) {}

  handleLyricsClick(time: number) {
    const audioPlayer = document.getElementById(
      'audio-player-player'
    )! as HTMLAudioElement;
    audioPlayer.currentTime = time / 1000;
  }

  ngOnInit(): void {
    this.songPlayerService.currentSong$.subscribe((song) => {
      if (!song) return;
      this.lyricsService.getLyricsBySongId(song.id).subscribe((data) => {
        const tempArr: {
          original: SyncedLyrics['lyric_lines'][number];
          translated: SyncedLyrics['lyric_lines'][number];
        }[] = [];
        data.data;
        const parsed = JSON.parse(data.data.lyric) as SyncedLyricsPair;
        const originalLyrics = parsed.original.lyric_lines;
        const translatedLyrics = parsed.translated.lyric_lines;
        originalLyrics.forEach((line, i) => {
          tempArr.push({
            original: originalLyrics[i],
            translated: translatedLyrics[i],
          });
        });
        this.lyricsPaired = tempArr;
      });
    });
    this.songPlayerService.elapsedTime$.subscribe((time) => {
      this.currentTime = time * 1000;
    });
  }
}
