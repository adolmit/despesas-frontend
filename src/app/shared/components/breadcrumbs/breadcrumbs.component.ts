import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

export type IBreadcrumb = {
  nombre: string;
  url?: string;
  active?: boolean;
};

@Component({
  selector: 'breadcrumbs',
  templateUrl: 'breadcrumbs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent implements OnInit {
  @Input() breadcrumbs: IBreadcrumb[] = [];

  constructor() {}

  ngOnInit() {}

  hasUrl(url: string | undefined): boolean {
    if (typeof url !== 'string') return false;

    return url.trim().length > 0;
  }
}
