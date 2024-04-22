import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'album-recommend-container',
  templateUrl: './album-recommend-container.component.html',
  styleUrls: ['./album-recommend-container.component.css'],
})
export class AlbumRecommendContainer implements OnInit {
  @ContentChild('content', { read: TemplateRef })
  content?: TemplateRef<unknown>;
  @Input() title: string = '';
  @Input() showAllHref?: string;
  ngOnInit(): void {}
}
