import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { InputNumberModule } from 'primeng/inputnumber';
import { PopoverModule } from 'primeng/popover';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import {
  AddWidgetEvent,
  WidgetCatalogGroup,
  WIDGET_TYPE_CONFIG,
  WIDGET_TYPES,
  WidgetType,
} from '../../models/widget.model';

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
  host: { style: 'container-type: inline-size' },
})
export class DashboardHeader {
  userName = input('');
  lastLogin = input('');
  columns = input(6);
  activeFilters = input<ReadonlySet<WidgetType>>(new Set(WIDGET_TYPES));
  widgetCatalog = input<WidgetCatalogGroup[]>([]);

  columnsChange = output<number>();
  toggleFilter = output<WidgetType>();
  addWidget = output<AddWidgetEvent>();

  /* Maps widget catalog groups to PrimeNG menu items */
  protected readonly menuItems = computed<MenuItem[]>(() =>
    this.widgetCatalog().map((group) => ({
      label: group.label,
      icon: group.icon,
      items: group.items.map((item) => ({
        label: item.label,
        command: () => this.addWidget.emit({ type: item.type, variantId: item.variantId }),
      })),
    })),
  );

  protected readonly filterItems = computed(() => {
    const active = this.activeFilters();
    return WIDGET_TYPES.map((type) => ({
      type,
      label: WIDGET_TYPE_CONFIG[type].label,
      active: active.has(type),
    }));
  });

  protected onColumnsChange(value: number | null): void {
    if (value && value >= 1 && value <= 12) {
      this.columnsChange.emit(value);
    }
  }
}
