import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PropertiesService } from 'src/app/components/services/properties.service';
import { TabsComponent } from 'src/app/components/shared/tabs/tabs.component';

@Component({
  selector: 'app-property-create',
  templateUrl: './property-create.component.html',
  styleUrls: ['./property-create.component.css']
})
export class PropertyCreateComponent {


  @ViewChild(TabsComponent) changeTab! : TabsComponent;

  constructor(private pl: PropertiesService){}


  
  tabs: string[] = ['Property Details', 'Media', 'Property Contacts', 'Features/Amenities', 'ESG Certification', 'Confirm']
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
