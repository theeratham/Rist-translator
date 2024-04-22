import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SongService } from 'src/app/service/song/song.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchbarComponent implements OnInit {
  searchInput: string = '';
  @Output() searchResult: EventEmitter<any[]> = new EventEmitter<any[]>();

  constructor(private songService: SongService, private router: Router) {}

  ngOnInit(): void {}

  search() {
    const searchTrimmed = this.searchInput.trim();
    if (searchTrimmed === '') {
      return;
    }
    this.router.navigate(['search'], {
      queryParams: { query: searchTrimmed },
    });
  }
}
