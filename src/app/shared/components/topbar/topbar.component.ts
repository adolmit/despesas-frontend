import {
  Component,
  OnInit,
  Input,
  Output,
  ChangeDetectionStrategy,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'topbar',
  templateUrl: 'topbar.component.html',
  styleUrls: ['topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  @Input() titulo = '';
  @Input() subtitulo = '';
  @Input() conBoton = true;
  @Input() btnIcono = 'x';
  @Input() btnTexto = 'x';
  @Input() btnLink = 'x';
  @Input() asLink = true; // necesita pasarle routerlink
  @Input() isLocalRoute = true;
  @Input() toUrl: string = '';
  @Input() showCancel: boolean = true;
  @Output() click = new EventEmitter();
}
