import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { DashboardWidget, ChartType } from '../../models/widget.model';
import { KpiCard } from '../kpi-card/kpi-card';
import { StatCard } from '../stat-card/stat-card';
import { ChartCard } from '../chart-card/chart-card';

const CHART_BASE_OPTIONS = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        padding: 16,
      },
    },
  },
};

const HORIZONTAL_BAR_OPTIONS = {
  ...CHART_BASE_OPTIONS,
  indexAxis: 'y' as const,
  scales: {
    x: { stacked: true, grid: { display: false } },
    y: { stacked: true, grid: { display: false } },
  },
};

const RADAR_OPTIONS = {
  ...CHART_BASE_OPTIONS,
  scales: {
    r: {
      grid: { color: 'rgba(0,0,0,0.05)' },
      angleLines: { color: 'rgba(0,0,0,0.05)' },
      pointLabels: { font: { size: 11 } },
    },
  },
};

@Component({
  selector: 'app-widget-host',
  imports: [SkeletonModule, ButtonModule, PopoverModule, KpiCard, StatCard, ChartCard],
  templateUrl: './widget-host.html',
  styleUrl: './widget-host.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetHost {
  widget = input.required<DashboardWidget>();
  remove = output<string>();

  protected readonly actionsOpen = signal(false);

  private readonly chartCard = viewChild(ChartCard);

  protected readonly isChartWidget = computed(() => {
    const type = this.widget().type;
    return type === 'bar-chart' || type === 'radar-chart' || type === 'horizontal-bar-chart';
  });

  protected readonly chartOptions = computed(() => {
    const type = this.widget().type;
    if (type === 'horizontal-bar-chart') return HORIZONTAL_BAR_OPTIONS;
    if (type === 'radar-chart') return RADAR_OPTIONS;
    return CHART_BASE_OPTIONS;
  });

  protected readonly chartType = computed<ChartType>(() => {
    const type = this.widget().type;
    if (type === 'radar-chart') return 'radar';
    return 'bar';
  });

  protected onRemove(): void {
    this.remove.emit(this.widget().id);
  }

  protected onDownloadChart(): void {
    const base64 = this.chartCard()?.getBase64Image();
    if (!base64) return;

    const link = document.createElement('a');
    link.download = `${this.widget().title || 'chart'}.png`;
    link.href = base64;
    link.click();
  }
}
