import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CARD_PT_FILL_STRETCH } from '../shared/card-passthrough';
import { ChartType } from '../../models/widget.model';

@Component({
  selector: 'app-chart-card',
  imports: [CardModule, ChartModule],
  templateUrl: './chart-card.html',
  styleUrl: './chart-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
})
export class ChartCard {
  title = input.required<string>();
  subtitle = input<string>();
  chartType = input.required<ChartType>();
  chartData = input.required<object>();
  chartOptions = input<object>();

  protected readonly cardPt = CARD_PT_FILL_STRETCH;
}
