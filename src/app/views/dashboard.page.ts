import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Gridster, GridsterItem } from 'angular-gridster2';
import { DashboardHeader } from '../components/dashboard-header/dashboard-header';
import { WidgetHost } from '../components/widget-host/widget-host';
import { WidgetType } from '../models/widget.model';
import { DashboardStateService } from '../services/dashboard-state.service';
import { UserStateService } from '../services/user-state.service';
@Component({
  selector: 'app-dashboard-page',
  imports: [Gridster, GridsterItem, DashboardHeader, WidgetHost],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly dashboardService = inject(DashboardStateService);
  private readonly userService = inject(UserStateService);

  protected readonly filteredWidgets = this.dashboardService.filteredWidgets;
  protected readonly columns = this.dashboardService.columns;
  protected readonly typeFilter = this.dashboardService.typeFilter;
  protected readonly gridOptions = this.dashboardService.gridOptions;
  protected readonly addWidgetMenuItems = this.dashboardService.addWidgetMenuItems;
  protected readonly userProfile = this.userService.userProfile;

  protected onRemoveWidget(id: string): void {
    this.dashboardService.removeWidget(id);
  }

  protected onColumnsChange(columns: number): void {
    this.dashboardService.updateColumns(columns);
  }

  protected onToggleFilter(type: WidgetType): void {
    this.dashboardService.toggleTypeFilter(type);
  }
}
