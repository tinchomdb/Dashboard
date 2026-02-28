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
import {
  DashboardWidget,
  ChartType,
  KpiData,
  StatData,
  ChartData,
  Badge,
} from '../../models/widget.model';
import { KpiCard } from './kpi-card/kpi-card';
import { StatCard } from './stat-card/stat-card';
import { ChartCard } from './chart-card/chart-card';

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

const LINE_OPTIONS = {
  ...CHART_BASE_OPTIONS,
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
  },
};

const PIE_DOUGHNUT_OPTIONS = {
  ...CHART_BASE_OPTIONS,
  plugins: {
    ...CHART_BASE_OPTIONS.plugins,
    legend: {
      ...CHART_BASE_OPTIONS.plugins.legend,
      position: 'right' as const,
    },
  },
};

const POLAR_AREA_OPTIONS = {
  ...CHART_BASE_OPTIONS,
  scales: {
    r: {
      grid: { color: 'rgba(0,0,0,0.05)' },
      ticks: { display: false },
    },
  },
};

@Component({
  selector: 'app-widget-host',
  imports: [SkeletonModule, ButtonModule, PopoverModule, KpiCard, StatCard, ChartCard],
  templateUrl: './widget-host.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
})
export class WidgetHost {
  widget = input.required<DashboardWidget>();
  remove = output<string>();

  protected readonly actionsOpen = signal(false);

  private readonly chartCard = viewChild(ChartCard);

  protected readonly isChartWidget = computed(() => this.widget().type.endsWith('-chart'));

  protected readonly displayValue = computed<string | number>(() => {
    const data = this.widget().data as KpiData | StatData | null;
    return data?.value ?? '--';
  });

  protected readonly statBadge = computed<Badge | undefined>(() => {
    const data = this.widget().data as StatData | null;
    return data?.badge;
  });

  protected readonly chartOptions = computed(() => {
    const type = this.widget().type;
    if (type === 'horizontal-bar-chart') return HORIZONTAL_BAR_OPTIONS;
    if (type === 'radar-chart') return RADAR_OPTIONS;
    if (type === 'line-chart') return LINE_OPTIONS;
    if (type === 'pie-chart' || type === 'doughnut-chart') return PIE_DOUGHNUT_OPTIONS;
    if (type === 'polar-area-chart') return POLAR_AREA_OPTIONS;
    return CHART_BASE_OPTIONS;
  });

  private static readonly CHART_TYPE_MAP: Record<string, ChartType> = {
    'bar-chart': 'bar',
    'horizontal-bar-chart': 'bar',
    'radar-chart': 'radar',
    'line-chart': 'line',
    'pie-chart': 'pie',
    'doughnut-chart': 'doughnut',
    'polar-area-chart': 'polarArea',
  };

  protected readonly chartType = computed<ChartType>(
    () => WidgetHost.CHART_TYPE_MAP[this.widget().type] ?? 'bar',
  );

  protected readonly chartData = computed<ChartData>(
    () => (this.widget().data as ChartData) ?? { labels: [], datasets: [] },
  );

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
