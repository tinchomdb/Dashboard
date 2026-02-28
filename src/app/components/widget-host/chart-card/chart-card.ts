import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule, UIChart } from 'primeng/chart';
import { CARD_PT_FILL_STRETCH } from '../shared/card-passthrough';
import { ChartType, ChartData } from '../../../models/widget.model';

@Component({
  selector: 'app-chart-card',
  imports: [CardModule, ChartModule],
  templateUrl: './chart-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
})
export class ChartCard {
  title = input.required<string>();
  subtitle = input<string>();
  chartType = input.required<ChartType>();
  chartData = input.required<ChartData>();
  chartOptions = input<object>();

  private readonly chartRef = viewChild(UIChart);

  protected readonly cardPt = CARD_PT_FILL_STRETCH;

  getBase64Image(): string | null {
    return this.chartRef()?.chart?.toBase64Image() ?? null;
  }
}
