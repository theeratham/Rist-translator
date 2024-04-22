import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Album, Artist, Lyrics, Song } from 'src/app/model/app.model';
import { SongPlayerService } from 'src/app/service/song-player/song-player.service';
import {
  SongSearchResults,
  SongService,
} from 'src/app/service/song/song.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  searchResults: SongSearchResults = {
    albums: [],
    artists: [],
    songs: [],
    lyrics: [],
  };
  lyricsSongs: Song[] = []

  foundNone: boolean = false;
  isLoading: boolean = true;

  constructor(
    private songService: SongService,
    private songPlayerService: SongPlayerService,
    private route: ActivatedRoute
  ) {}
  handleSongListPlayEvent(from: number = 0) {
    const playingSongs = this.searchResults.songs.slice(from);
    this.songPlayerService.setPlaylist(playingSongs);
  } // copy from ^ to V hai noi

  handleLyricsEvent(from: number = 0) {
    const playingSongs = this.lyricsSongs.slice(from);
    this.songPlayerService.setPlaylist(playingSongs);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params.query) {
        this.searchQuery = params.query;
        this.search();
      }
    });
  }

  search() {
    this.songService.search(this.searchQuery).subscribe(
      (data) => {
        this.searchResults = data.data;
        this.lyricsSongs = this.searchResults.lyrics.map(l => l.song)
        this.isLoading = false;
        this.foundNone = !(
          this.searchResults.albums.length ||
          this.searchResults.artists.length ||
          this.searchResults.songs.length ||
          this.searchResults.lyrics.length
        );
      },
      (error) => {
        console.log('search failed', error);
      }
    );
  }
}
