import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'song-listing-container',
  templateUrl: './song-listing-container.component.html',
  styleUrls: ['./song-listing-container.component.css'],
})
export class SongListingContainer implements OnInit {
  @ContentChild('content', { read: TemplateRef })
  content?: TemplateRef<unknown>;
  @Input() title: string = '';
  ngOnInit(): void {}
}
