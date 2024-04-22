import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Song } from 'src/app/model/app.model';
declare const navigator: any;

@Injectable({
  providedIn: 'root',
})
export class SongPlayerService {
  private currentSongIndex = 0;
  private playlist: Song[] = [];
  private audioPlayerSubject = new Subject<ElementRef<HTMLAudioElement>>();
  audioPlayer$: Observable<ElementRef<HTMLAudioElement>> =
    this.audioPlayerSubject.asObservable();

  private elapsedTimeSubject = new BehaviorSubject<number>(0);
  elapsedTime$: Observable<number> = this.elapsedTimeSubject.asObservable();

  private volumeSubject = new BehaviorSubject<number>(1);
  currentVolume$: Observable<number> = this.volumeSubject.asObservable();

  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  currentSong$: Observable<Song | null> =
    this.currentSongSubject.asObservable();

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  isPlaying$: Observable<boolean> = this.isPlayingSubject.asObservable();

  constructor() {
    this.loadPlaylistFromLocalStorage();
    this.loadVolumeFromLocalStorage();
  }

  setAudioPlayer(audioPlayer: ElementRef<HTMLAudioElement>) {
    this.audioPlayerSubject.next(audioPlayer);
  }

  resetAll() {
    this.resetList();
    this.setVolume(1);
  }

  resetList() {
    this.playlist = [];
    this.currentSongIndex = 0;
    this.savePlaylistToLocalStorage();
    this.playCurrentSong();
  }

  setTimeElapsed(time: number) {
    this.elapsedTimeSubject.next(time);
  }

  private loadVolumeFromLocalStorage() {
    const volumeString = localStorage.getItem('volume');
    if (volumeString) {
      this.volumeSubject.next(Number.parseFloat(volumeString));
    }
  }

  private loadPlaylistFromLocalStorage() {
    const playlistString = localStorage.getItem('playlist');
    if (playlistString) {
      this.playlist = JSON.parse(playlistString);
      this.currentSongIndex = 0;
      this.playCurrentSong();
    }
  }

  private savePlaylistToLocalStorage() {
    localStorage.setItem('playlist', JSON.stringify(this.playlist));
  }

  addToPlaylist(song: Song) {
    this.playlist.push(song);
    this.savePlaylistToLocalStorage();
  }

  setPlaylist(songs: Song[]) {
    this.playlist = songs;
    this.currentSongIndex = 0;
    this.savePlaylistToLocalStorage();
    this.playCurrentSong();
  }

  playCurrentSong() {
    if (this.playlist.length > 0) {
      this.currentSongSubject.next(this.playlist[this.currentSongIndex]);
      this.isPlayingSubject.next(navigator.userActivation.hasBeenActive);
    } else {
      this.currentSongSubject.next(null);
      this.isPlayingSubject.next(false);
    }
  }

  playNextSong() {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
    this.playCurrentSong();
  }

  playPreviousSong() {
    this.currentSongIndex =
      (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
    this.playCurrentSong();
  }

  setVolume(volume: number) {
    this.volumeSubject.next(volume);
    localStorage.setItem('volume', this.volumeSubject.getValue().toString());
  }

  togglePlayPause() {
    this.isPlayingSubject.next(!this.isPlayingSubject.value);
  }
}
