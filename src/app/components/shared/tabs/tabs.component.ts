import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent {
  @Input() tabsMenu: string[] = [];
  @Output() onTabChange = new EventEmitter<number>();

  activeTab: number = 0;

  selectTab(e: number) {
    this.activeTab = e
    this.onTabChange.emit(this.activeTab)

  }
}
