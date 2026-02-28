import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CARD_PT_FILL } from '../shared/card-passthrough';
import { Badge } from '../../../models/widget.model';

@Component({
  selector: 'app-stat-card',
  imports: [CardModule, TagModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full', style: 'container-type: size' },
})
export class StatCard {
  title = input.required<string>();
  value = input<string | number>('--');
  badge = input<Badge>();

  protected readonly cardPt = CARD_PT_FILL;
}
