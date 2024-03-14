import { Component, EventEmitter, Output } from '@angular/core';
import { DropdownListService } from 'src/app/components/services/dropdown-list.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PropertiesService } from 'src/app/components/services/properties.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-property-contacts',
  templateUrl: './property-contacts.component.html',
  styleUrls: ['./property-contacts.component.css']
})
export class PropertyContactsComponent {

  @Output() nextTabSwitch = new EventEmitter()

  constructor(private dropdowns: DropdownListService,
    private pl: PropertiesService,
    private toastr: ToastrService,) { }

  activatedTabsIndex: number = 3;

  selectedCar: any;

  PropertyId: any;

  leasingContactList: any[] = []
  brokerLiaisonList: any[] = []
  leasingSelect: any;
  brokerSelect: any;

  propertyContact = new FormGroup({
    LeasingExecutiveId: new FormControl(''),
    BrokerLiaisonId: new FormControl(''),
  })

  ngOnInit() {
    const propertyId = localStorage.getItem('PropertyId');
    this.PropertyId = propertyId;
    this.getContactDetails();
    this.getPropertyLeasing();
    this.getBrokerLiaison();
  }

  getPropertyLeasing() {
    this.dropdowns.propertLeasingList(this.PropertyId).subscribe((pl: any) => {
      // console.log(pl);
      this.leasingContactList = pl.data
    })
  }

  getBrokerLiaison() {
    this.dropdowns.brokerLiaisonList(this.PropertyId).subscribe((bl: any) => {
      // console.log(bl);
      this.brokerLiaisonList = bl.data
    })
  }

  itemSelected(e: any) {
    // console.log(e)
  }

  updateContacts() {
    this.pl.addPropertyStep3(this.propertyContact.value, this.PropertyId).subscribe((pc: any) => {
      if (pc.status === 'success') {
        this.toastr.success(pc.message);
        this.nextTabSwitch.emit(this.activatedTabsIndex);
        // console.log(pc);
      }
    })
  }

  getContactDetails(){
    this.pl.propertyDetails(this.PropertyId).subscribe((pd: any) => {
      // console.log(pd);
      this.propertyContact.patchValue({
        LeasingExecutiveId: pd.data.leasingexecutive.Id,
        BrokerLiaisonId: pd.data.brokerliaison.Id
      })

      
    })
  }

}
