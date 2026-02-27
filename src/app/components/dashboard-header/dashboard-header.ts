import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { InputNumberModule } from 'primeng/inputnumber';
import { PopoverModule } from 'primeng/popover';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { WIDGET_TYPE_LABELS, WIDGET_TYPES, WidgetType } from '../../models/widget.model';

@Component({
  selector: 'app-dashboard-header',
  imports: [
    ButtonModule,
    MenuModule,
    InputNumberModule,
    PopoverModule,
    CheckboxModule,
    FormsModule,
  ],
  templateUrl: './dashboard-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHeader {
  userName = input('');
  lastLogin = input('');
  columns = input(6);
  activeFilters = input<ReadonlySet<WidgetType>>(new Set(WIDGET_TYPES));
  addWidgetMenuItems = input<MenuItem[]>([]);

  download = output<void>();
  columnsChange = output<number>();
  toggleFilter = output<WidgetType>();

  protected readonly filterItems = computed(() => {
    const active = this.activeFilters();
    return WIDGET_TYPES.map((type) => ({
      type,
      label: WIDGET_TYPE_LABELS[type],
      active: active.has(type),
    }));
  });

  protected onColumnsChange(value: number | null): void {
    if (value && value >= 1 && value <= 12) {
      this.columnsChange.emit(value);
    }
  }
}
