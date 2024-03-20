import { Component, ViewChild } from '@angular/core';
import { TabsComponent } from 'src/app/components/shared/tabs/tabs.component';

@Component({
  selector: 'app-unit-section',
  templateUrl: './unit-section.component.html',
  styleUrls: ['./unit-section.component.css']
})
export class UnitSectionComponent {

  @ViewChild(TabsComponent) changeTab! : TabsComponent;
  tabs: string[] = ['Unit Details', 'Unit Media', 'Features/Amenities']
  activatedTabsIndex: number = 0

  onTabChange(tb: number) {
    this.activatedTabsIndex = tb;
  }
  
  onTabChangeChild(rr: number) {
    this.onTabChange(rr)
    this.changeTab.activeTab = rr
    // console.log(this.activatedTabsIndex); 
    
  }

}
