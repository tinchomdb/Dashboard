import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Gridster, GridsterItem } from 'angular-gridster2';
import { DashboardHeader } from '../components/dashboard-header/dashboard-header';
import { WidgetHost } from '../components/widget-host/widget-host';
import { AddWidgetEvent, WidgetType } from '../models/widget.model';
import { DashboardService } from '../services/dashboard.service';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-dashboard-page',
  imports: [Gridster, GridsterItem, DashboardHeader, WidgetHost],
  templateUrl: './dashboard.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
})
export class DashboardPage {
  private readonly dashboardService = inject(DashboardService);
  private readonly userService = inject(UserService);

  protected readonly filteredWidgets = this.dashboardService.filteredWidgets;
  protected readonly columns = this.dashboardService.columns;
  protected readonly typeFilter = this.dashboardService.typeFilter;
  protected readonly gridOptions = this.dashboardService.gridOptions;
  protected readonly widgetCatalog = this.dashboardService.widgetCatalog;
  protected readonly userProfile = this.userService.userProfile;

  protected onRemoveWidget(id: string): void {
    this.dashboardService.removeWidget(id);
  }

  protected onAddWidget(event: AddWidgetEvent): void {
    this.dashboardService.addWidget(event);
  }

  protected onColumnsChange(columns: number): void {
    this.dashboardService.updateColumns(columns);
  }

  protected onToggleFilter(type: WidgetType): void {
    this.dashboardService.toggleTypeFilter(type);
  }
}
