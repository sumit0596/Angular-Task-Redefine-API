import { Component } from '@angular/core';
import { ApiServicesService } from '../../services/api-services.service';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.css']
})
export class LeftmenuComponent {

  menu: any[] = [];


  constructor(private apiServices: ApiServicesService) { }


  ngOnInit() {
    this.allMenu();
  }

  allMenu() {
    // debugger;
    this.apiServices.getMenu().subscribe(
      (response: any) => {
        this.menu = response.data;
        // console.log(this.menu);
      })
  }


}
