import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'search-group-container',
  templateUrl: './search-group-container.component.html',
  styleUrls: ['./search-group-container.component.css'],
})
export class SearchGroupContainer implements OnInit {
  @ContentChild('content', { read: TemplateRef })
  content?: TemplateRef<unknown>;
  @Input() title: string = '';
  @Input() isColumnLayout: boolean = false;
  ngOnInit(): void {}
}
