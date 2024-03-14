import { Component, EventEmitter, Output } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PropertiesService } from 'src/app/components/services/properties.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-property-media',
  templateUrl: './property-media.component.html',
  styleUrls: ['./property-media.component.css'],
})
export class PropertyMediaComponent {

  @Output() nextTabSwitch = new EventEmitter()

  public files: NgxFileDropEntry[] = [];

  activatedTabsIndex: number = 2;

  mediaImages: any;

  PropertyId: any;

  timestamp: string = "";

  moveObj: any = {
    PropertyId: '',
    Media:
    {
      PropertyMediaId: '',
      Position: ''
    }

  }

  mediaLinkObj: any = {
    PropertyId: '',
    Links:
    {
      Url: '',
      Type: ''
    }

  }

  constructor(private pl: PropertiesService,
    private toastr: ToastrService) { }

  brochure: boolean = false;
  brochureToggleState: boolean = false;
  brochureToggleMediaLink: boolean = true;

  rateCard: boolean = false;
  rateCardToggleState: boolean = false;
  rateCardToggleMediaLink: boolean = true;

  video: boolean = false;
  videoToggleState: boolean = false;
  videoToggleMediaLink: boolean = true;


  mediaForm = new FormGroup({
    brochureMediaLink: new FormControl(''),
    rateCardMediaLink: new FormControl(''),
    videoMediaLink: new FormControl(''),
  })


  ngOnInit() {
    const propertyId = localStorage.getItem('PropertyId');
    this.PropertyId = propertyId;
    this.getDetailsPropertyMedia()
  }


  getValueMedia() {
    this.mediaLinkObj.PropertyId = this.PropertyId;
    this.mediaLinkObj.Links = [];

    if (this.mediaForm.value.brochureMediaLink) {
      this.mediaLinkObj.Links.push({
        Url: this.mediaForm.value.brochureMediaLink,
        Type: 'Brochure'
      });
    }

    if (this.mediaForm.value.rateCardMediaLink) {
      this.mediaLinkObj.Links.push({
        Url: this.mediaForm.value.rateCardMediaLink,
        Type: 'RateCard'
      });
    }

    if (this.mediaForm.value.videoMediaLink) {
      this.mediaLinkObj.Links.push({
        Url: this.mediaForm.value.videoMediaLink,
        Type: 'Video'
      });
    }

    // console.log(this.mediaLinkObj);


    this.pl.uploadPropertyMediaLink(this.mediaLinkObj).subscribe((mdl: any) => {
      if (mdl.status === 'success') {
        this.toastr.success(mdl.message);
        this.ngOnInit();
        this.nextTabSwitch.emit(this.activatedTabsIndex);
      }
    })
  }


  dropped(files: NgxFileDropEntry[], arrgs: string) {
    this.files = files
    // console.log(files);

    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {

          // console.log(file);

          const formData = new FormData();
          formData.append('File', file, file.name);
          formData.append('PropertyId', this.PropertyId);
          formData.append('Type', arrgs);


          this.uploadMedia(formData);

        })
      }

    }
  }

  uploadMedia(formData: FormData) {
    this.pl.uploadPropertyImages(formData).subscribe((upfiles: any) => {
      if (upfiles.status === 'success') {
        // console.log(upfiles);
        this.toastr.success(upfiles.message);
        this.ngOnInit();
      }
    })

  }



  fileLeave(e: any) {
    // console.log('fileleave',e);
  }

  openFileSelector(el: any) {
    // console.log('fileselect',el);

  }

  drop(event: CdkDragDrop<any[]>) {
    this.moveObj.Media = [];


    moveItemInArray(this.files, event.previousIndex, event.currentIndex);

    this.mediaImages.Image.forEach((x: any, inx: any) => {
      this.moveObj.PropertyId = this.PropertyId;
      if (x.Id === x.Id) {
        this.moveObj.Media.push({
          PropertyMediaId: x.Id,
          Position: inx
        });
        // this.moveObj.Media.PropertyMediaId = x.Id;
        // this.moveObj.Media.Position = inx;
        // console.log(this.moveObj);
        this.moveFilePosition(this.moveObj)
      }
    });


    // console.log(event.previousIndex, event.currentIndex);


  }


  toggleDiv(checked: boolean, checkSection: string) {
    switch (checkSection) {
      case 'brochure':
        this.brochure = checked;
        this.brochureToggleState = this.brochure;
        this.brochureToggleMediaLink = !this.brochure;
        break;
      case 'rateCard':
        this.rateCard = checked;
        this.rateCardToggleState = this.rateCard;
        this.rateCardToggleMediaLink = !this.rateCard;
        break;
      case 'video':
        this.video = checked;
        this.videoToggleState = this.video;
        this.videoToggleMediaLink = !this.video;
        break;
    }
  }

  getDetailsPropertyMedia() {
    this.pl.propertyDetails(this.PropertyId).subscribe((pd: any) => {
      this.mediaImages = pd.data.media

      this.mediaForm.patchValue({
        brochureMediaLink: pd.data?.media.Brochure['Url'] ,
        rateCardMediaLink: pd.data?.media.RateCard['Url'],
        videoMediaLink: pd.data?.media.Video['Url'],
      })
    })
  }

  onDeleteMedia(dl: any) {
    this.pl.propertyImagesDelete(dl).subscribe((del: any) => {
      // console.log(del);
      if (del.status === 'success') {
        this.toastr.success(del.message);
        this.ngOnInit();
      }
    })

  }

  moveFilePosition(dp: any) {

    // this.mediaImages.Image.map((x:any, inx:any)=>{
    //   this.moveObj.PropertyId = this.PropertyId
    //   this.moveObj.Media.PropertyMediaId = x.Id
    //   this.moveObj.Media.Position = dp
    //  })

    this.pl.propertyImagesPosition(dp).subscribe((mv: any) => {
      // console.log(mv);
    })
    this.getDetailsPropertyMedia()

  }

}

