import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CARD_PT_FILL } from '../shared/card-passthrough';

@Component({
  selector: 'app-kpi-card',
  imports: [CardModule],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full', style: 'container-type: size' },
})
export class KpiCard {
  title = input.required<string>();
  value = input<string | number>('--');

  protected readonly cardPt = CARD_PT_FILL;
}
