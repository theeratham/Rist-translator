import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { SimpleOuterSubscriber } from 'rxjs/internal/innerSubscribe';
import {
  Album,
  Artist,
  Lyrics,
  Song,
  SyncedLyrics,
  SyncedLyricsPair,
} from 'src/app/model/app.model';
import { AlbumService } from 'src/app/service/album/album.service';
import { ArtistService } from 'src/app/service/artist/artist.service';
import { LyricsService } from 'src/app/service/lyrics/lyrics.service';
import { SongService } from 'src/app/service/song/song.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css'],
})
export class SongComponent implements OnInit {
  @ViewChild('SongModal', { static: true }) songModal!: ModalDirective;
  @ViewChild('ArtistModal', { static: true }) artistModal!: ModalDirective;
  @ViewChild('AlbumModal', { static: true }) albumModal!: ModalDirective;
  @ViewChild('LyricsModal', { static: true }) lyricsModal!: ModalDirective;
  songFile: File | null = null;
  songPicFile: File | null = null;
  songAlbumId: number = 0;
  songArtistId: number = 0;
  songLyricsId: number = 0;
  artistName: string = '';
  artistPicFile: File | null = null;
  description: string = '';
  albumName: string = '';
  albumYear: string = '';
  albumPicFile: File | null = null;
  lyFile: File | null = null;

  songAddAlbums: Album[] = [];
  songAddArtists: Artist[] = [];
  songAddLyrics: Lyrics[] = [];

  spotifyLyricsId: string = '';
  lyricSongName: string = '';
  editingLyrics: {
    original: SyncedLyrics['lyric_lines'][0];
    ai?: SyncedLyrics['lyric_lines'][0];
    translated?: SyncedLyrics['lyric_lines'][0];
  }[] = [];

  songs: Song[] = [];
  constructor(
    private songService: SongService,
    private artistService: ArtistService,
    private albumService: AlbumService,
    private lyricsService: LyricsService
  ) {}

  ngOnInit(): void {
    this.getAllSong();
  }

  copyLyrics(index: number) {
    this.editingLyrics[index].translated = this.editingLyrics[index].ai;
  }

  updateLyrics(index: number, event: Event) {
    this.editingLyrics[index].translated = {
      startTimeMs: this.editingLyrics[index].original.startTimeMs,
      words: (event.target as HTMLInputElement).value,
    };
  }

  getSpotifyLyrics() {
    this.lyricsService.getSpotifySyncedLyrics(this.spotifyLyricsId).subscribe(
      (response) => {
        this.editingLyrics = response.data.lyric_lines.map(
          (line: SyncedLyrics['lyric_lines'][number]) => ({
            original: line,
          })
        );
      },
      (error) => {
        console.error('Error getting lyrics', error);
      }
    );
    this.lyricsService.getAiLyrics(this.spotifyLyricsId).subscribe(
      (response) => {
        this.editingLyrics.forEach((line, index) => {
          line.ai = response.data.lyric_lines[index];
        });
      },
      (error) => {
        console.error('Error getting lyrics', error);
      }
    );
  }

  onFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      console.log('FileUpload -> files', fileList);
      this.lyFile = fileList[0];
    }
  }

  onSongSongFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.songFile = fileList[0];
    }
  }

  onSongPicFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.songPicFile = fileList[0];
    }
  }

  onAlbumFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.albumPicFile = fileList[0];
    }
  }

  onArtistFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.artistPicFile = fileList[0];
    }
  }

  getAllSong() {
    this.songService.getAllSong().subscribe((response) => {
      this.songs = response.data;
    });
  }

  createSong() {
    this.songService
      .createSong(
        this.songFile!,
        this.songAlbumId,
        this.songArtistId,
        this.songLyricsId,
        this.songPicFile!
      )
      .subscribe(
        (data) => {
          console.log('add song successful', data);
          alert('add song successful');
          this.getAllSong();
          this.closeModal('song');
        },
        (error) => {
          console.log('add failed', error);
          alert('add failed');
        }
      );
  }

  deleteSong(song_id: number) {
    if (confirm('Are you sure you want to delete?')) {
      this.songService.deleteSong(song_id).subscribe(
        (data) => {
          console.log('delete song successful', data);
          this.getAllSong();
        },
        (error) => {
          console.log('delete failed', error);
        }
      );
    }
  }

  createArtist() {
    console.log(
      'create artist',
      this.artistName,
      this.description,
      this.artistPicFile
    );
    this.artistService
      .createArtist(this.artistName, this.description, this.artistPicFile!)
      .subscribe(
        (data) => {
          console.log('add artist successful', data);
          alert('add artist successful');
          this.closeModal('artist');
        },
        (error) => {
          console.log('add failed', error);
          alert('add failed');
          // this.closeModal('artist');
        }
      );
  }

  createAlbum() {
    this.albumService
      .createAlbum(this.albumName, this.albumYear, this.albumPicFile!)
      .subscribe(
        (data) => {
          console.log('add album successful', data);
          alert('add album successful');
          this.closeModal('album');
        },
        (error) => {
          console.log('add failed', error);
          alert('add failed');
        }
      );
  }

  createLyrics() {
    const lyrics: SyncedLyricsPair = {
      original: {
        lyric_lines: this.editingLyrics.map((line) => line.original),
      },
      translated: {
        lyric_lines: this.editingLyrics.map((line) => line.translated!),
      },
    };
    this.lyricsService.createLyrics(lyrics, this.lyricSongName).subscribe(
      (data) => {
        console.log('add lyrics successful', data);
        alert('add lyrics successful');
        this.closeModal('lyrics');
      },
      (error) => {
        console.log('add failed', error);
        alert('add failed');
      }
    );
  }

  loadRequiredDropdowns() {
    this.albumService.getAllAlbum().subscribe((response) => {
      this.songAddAlbums = response.data;
    });
    this.artistService.getAllArtist().subscribe((response) => {
      this.songAddArtists = response.data;
    });
    this.lyricsService.getAllLyrics().subscribe((response) => {
      this.songAddLyrics = response.data;
    });
  }

  openModal(modalName: string) {
    switch (modalName) {
      case 'song':
        this.songModal.show();
        this.loadRequiredDropdowns();
        break;
      case 'artist':
        this.artistModal.show();
        break;
      case 'album':
        this.albumModal.show();
        break;
      case 'lyrics':
        this.lyricsModal.show();
        break;
      default:
        break;
    }
  }

  closeModal(modalName: string) {
    switch (modalName) {
      case 'song':
        this.songModal.hide();
        this.clearFileInput('song_file');
        this.clearFileInput('song_pic_file');
        this.clearFileInput('album_id');
        this.clearFileInput('artist_id');
        this.clearFileInput('lyrics_id');
        break;
      case 'artist':
        this.artistModal.hide();
        this.clearFileInput('artist_name');
        this.clearFileInput('description');
        this.clearFileInput('artist_pic_file');
        break;
      case 'album':
        this.albumModal.hide();
        this.clearFileInput('album_name');
        this.clearFileInput('year');
        this.clearFileInput('album_pic_file');
        break;
      case 'lyrics':
        this.lyricsModal.hide();
        this.clearFileInput('lyrics_file');
        break;
      default:
        break;
    }
  }

  clearFileInput(id: string) {
    const fileInput = <HTMLInputElement>document.getElementById(id);
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
