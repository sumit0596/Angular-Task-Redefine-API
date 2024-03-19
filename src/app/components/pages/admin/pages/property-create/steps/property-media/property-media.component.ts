import { Component, EventEmitter, Output } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PropertiesService } from 'src/app/components/services/properties.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

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

  mediaCheck: boolean = false;
  brochureMediaShow: boolean = false;
  rateCardMediaShow: boolean = false;
  videoMediaShow: boolean = false;

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
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) { }

  mediaForm = new FormGroup({
    brochureMediaLink: new FormControl(''),
    rateCardMediaLink: new FormControl(''),
    videoMediaLink: new FormControl(''),
  })


  ngOnInit() {
    const propertyId = localStorage.getItem('PropertyId');
    this.PropertyId = propertyId;
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.getDetailsPropertyMedia()
    }, 2000)
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
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
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
    this.pl.uploadPropertyImages(formData).subscribe({
      next: (upfiles: any) => {
        (upfiles.status === 'success') ? (this.toastr.success(upfiles.message), this.ngOnInit()) : null
      }, error: (error: HttpErrorResponse) => {
        this.toastr.success(error.error.message)
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
        this.moveFilePosition(this.moveObj)
      }
    });
  }


  toggleDiv(checked: boolean, linkValue: string) {
    linkValue === 'brochure' ? checked === true ? this.brochureMediaShow = true : this.brochureMediaShow = false :
    linkValue === 'rateCard' ? checked === true ? this.rateCardMediaShow = true : this.rateCardMediaShow = false :
    linkValue === 'video' ? checked === true ? this.videoMediaShow = true : this.videoMediaShow = false : null;
  }

  getDetailsPropertyMedia() {
    this.pl.propertyDetails(this.PropertyId).subscribe((pd: any) => {
      this.mediaImages = pd.data.media
      if(this.mediaImages.Brochure.IsFile === 0 && this.mediaImages.Brochure.IsFile === 0 && this.mediaImages.Video.IsFile === 0 ){
        this.mediaForm.patchValue({
          brochureMediaLink: pd.data?.media?.Brochure['Url'],
          rateCardMediaLink: pd.data?.media?.RateCard['Url'],
          videoMediaLink: pd.data?.media?.Video['Url'],
        })
      }
      
    })
  }

  onDeleteMedia(dl: any) {
    this.pl.propertyImagesDelete(dl).subscribe({
      next: (del: any) => {
        (del.status === 'success') ? (this.toastr.success(del.message), this.ngOnInit()) : null
      }
    })
  }

  moveFilePosition(dp: any) {
    this.pl.propertyImagesPosition(dp).subscribe((mv: any) => {
      this.getDetailsPropertyMedia()
    })
  }

}

