import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Playlist, Song } from 'src/app/model/app.model';
import { PlaylistService } from 'src/app/service/playlist/playlist.service';
import { SongPlayerService } from 'src/app/service/song-player/song-player.service';

declare const navigator: any;

@Component({
  selector: 'app-song-player',
  templateUrl: './song-player.component.html',
  styleUrls: ['./song-player.component.css'],
})
export class SongPlayerComponent implements AfterViewInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('songProgress') songProgress!: ElementRef<HTMLDivElement>;
  song?: Song | null;
  volume: number = 1;
  isPlaying: boolean = false;
  songCurrentTime: string = '';
  songDuration: string = '';
  playlists: Playlist[] = [];
  hideTime: boolean = true;
  currentPath: string = '';
  savedPath: string = '';
  popupShown: boolean = false;

  constructor(
    private songPlayerService: SongPlayerService,
    private router: Router,
    private playlistService: PlaylistService
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPath = event.url;
      }
    });
  }

  hasSongInPlaylist(playlistId: number) {
    if (!this.song) {
      return false;
    }

    return this.playlists
      .find((playlist) => playlist.id === playlistId)
      ?.songs.find((song) => song.id === this.song?.id);
  }

  toggleAddSongToPlaylist(playlistId: number) {
    if (this.hasSongInPlaylist(playlistId)) {
      this.removeSongFromPlaylist(playlistId);
    } else {
      this.addSongToPlaylist(playlistId);
    }
  }

  removeSongFromPlaylist(playlistId: number) {
    if (this.song) {
      this.playlistService
        .removeSongFromplaylist(this.song.id, playlistId)
        .subscribe((response) => {
          this.playlistService.getMyPlaylist().subscribe((response) => {
            this.playlists = response.data;
          });
        });
    }
  }

  addSongToPlaylist(playlistId: number) {
    if (this.song) {
      this.playlistService
        .addSongToPlaylist(this.song.id, playlistId)
        .subscribe((response) => {
          this.playlistService.getMyPlaylist().subscribe((response) => {
            this.playlists = response.data;
          });
        });
    }
  }

  toggleAddToPlaylistPopup() {
    this.popupShown = !this.popupShown;
  }

  songProgressUpdate(event: Event) {
    const clickEvent = event as MouseEvent;
    const fullSize = this.songProgress.nativeElement.getBoundingClientRect();
    const clickPosition = clickEvent.offsetX;
    const percentage = clickPosition / fullSize.width;
    this.audioPlayer.nativeElement.currentTime =
      this.audioPlayer.nativeElement.duration * percentage;
  }

  ngAfterViewInit(): void {
    this.songPlayerService.currentSong$.subscribe((song) => {
      this.song = song;

      if (this.song) {
        fetch(this.song.filePath)
          .then((response) => response.blob())
          .then((blob) => {
            this.audioPlayer.nativeElement.src = URL.createObjectURL(blob);
            this.songDuration = String(this.audioPlayer.nativeElement.duration);
            this.updateTrackTime();
            this.audioPlayer.nativeElement.play();
          });
      }
    });
    this.songPlayerService.isPlaying$.subscribe((state) => {
      console.log(state);
      this.isPlaying = state;
      if (!navigator.userActivation.hasBeenActive) {
        return;
      }
      if (state) {
        this.audioPlayer.nativeElement.play();
      } else {
        this.audioPlayer.nativeElement.pause();
      }
    });
    this.songPlayerService.currentVolume$.subscribe((volume) => {
      this.audioPlayer.nativeElement.volume = volume;
    });
    this.playlistService.getMyPlaylist().subscribe((response) => {
      this.playlists = response.data;
    });

    this.audioPlayer.nativeElement.addEventListener('ended', () => {
      this.songPlayerService.playNextSong();
    });
  }

  playNextSong() {
    this.songPlayerService.playNextSong();
  }

  playPreviousSong() {
    this.songPlayerService.playPreviousSong();
  }

  // is a range slider
  setVolume(volumeChangeEvent: any) {
    this.songPlayerService.setVolume(volumeChangeEvent?.target?.value);
  }

  togglePlayPause() {
    this.songPlayerService.togglePlayPause();
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  toggleLyrics() {
    if (this.currentPath == '/lyrics') {
      this.router.navigate([this.savedPath]);
    } else {
      this.savedPath = this.currentPath;
      this.router.navigate(['/lyrics']);
    }
  }

  updateTrackTime() {
    this.songPlayerService.setTimeElapsed(
      this.audioPlayer.nativeElement.currentTime
    );
    const currTime = this.audioPlayer.nativeElement.currentTime;
    const duration = this.audioPlayer.nativeElement.duration;
    if (!isNaN(duration)) {
      this.hideTime = false;
    }

    const trackProgress = currTime / duration;
    document.getElementById('song-progress-progress')!.style.width = `${
      trackProgress * 100
    }%`;
    this.songCurrentTime = this.formatTime(Math.round(currTime));
    this.songDuration = this.formatTime(Math.round(duration));
  }
}
