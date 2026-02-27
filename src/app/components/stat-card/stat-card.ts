import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CARD_PT_FILL } from '../shared/card-passthrough';
import { TagSeverity } from '../../models/widget.model';

@Component({
  selector: 'app-stat-card',
  imports: [CardModule, TagModule],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  title = input.required<string>();
  value = input<string | number>('--');
  badge = input<string>();
  badgeSeverity = input<TagSeverity>('info');

  protected readonly cardPt = CARD_PT_FILL;
}
