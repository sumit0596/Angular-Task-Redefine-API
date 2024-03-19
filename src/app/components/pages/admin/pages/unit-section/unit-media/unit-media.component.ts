import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { ToastrService } from 'ngx-toastr';
import { PropertiesService } from 'src/app/components/services/properties.service';

@Component({
  selector: 'app-unit-media',
  templateUrl: './unit-media.component.html',
  styleUrls: ['./unit-media.component.css']
})
export class UnitMediaComponent {


  constructor(private pl: PropertiesService,
    private fb: FormBuilder,
    private toastr: ToastrService){
    this.propertyId = localStorage.getItem('PropertyId')
    this.unitId = localStorage.getItem('unitId')
  }


  ngOnInit() {
    this.featureUnitForm()
    this.getUnitMedia()
    
  }

  public files: NgxFileDropEntry[] = [];

  propertyId:any;
  unitId: any;

  mediaImages: any;
  mediaForm!:FormGroup
  toggleInput: boolean = true;

  toggleFieldVideo: boolean = false;
  toggleFieldFloor: boolean = false;


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
    PropertyUnitId: '',
    Links:[]
  }
  
  dropped(files: NgxFileDropEntry[], arrgs: string) {
    this.files = files
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

        fileEntry.file((file: File) => {

          const formData = new FormData();
          formData.append('File', file, file.name);
          formData.append('PropertyId', this.propertyId);
          formData.append('PropertyUnitId', this.unitId);
          formData.append('Type', arrgs);

          this.uploadMedia(formData);

        })
      }

    }
  }

  uploadMedia(formData: FormData) {
    this.pl.uploadPropertyImages(formData).subscribe((upfiles: any) => {
      if (upfiles.status === 'success') {
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
      this.moveObj.PropertyId = this.propertyId;
      if (x.Id === x.Id) {
        this.moveObj.Media.push({
          PropertyMediaId: x.Id,
          Position: inx
        });
        this.moveFilePosition(this.moveObj)
      }
    });
  }

  onDeleteMedia(dl: any) {
    this.pl.propertyImagesDelete(dl).subscribe((del: any) => {
      if (del.status === 'success') {
        this.toastr.success(del.message);
        this.ngOnInit();
      }
    })
  }

  moveFilePosition(dp: any) {
    this.pl.propertyImagesPosition(dp).subscribe((mv: any) => {
      if (mv.status === 'success') {
        this.ngOnInit()
      }
    })

  }
  

  getUnitMedia(){
    this.pl.propertyUnitDetails(this.unitId).subscribe({
      next: (res: any) => {
      console.log(res);
      this.mediaImages = res.data.media
      
      this.mediaForm.patchValue({
        videoMediaLink: res.data?.media.Video['Url'] ,
        floorPlanMediaLink: res.data?.media.FloorPlan['Url'],
      })

      
      if(this.mediaImages.Video.IsFile == 0){
        this.togleInputField(true, 'video')
      }

      if(this.mediaImages.FloorPlan.IsFile == 0){
        this.togleInputField(true, 'floor')
      }

      }, error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }


  featureUnitForm(){
    this.mediaForm = this.fb.group({
      videoMediaLink: new FormControl(''),
      floorPlanMediaLink: new FormControl(''),
    })
  }

  getValueMedia() {
    this.mediaLinkObj.PropertyId = this.propertyId;
    this.mediaLinkObj.PropertyUnitId = this.unitId;

    if (this.mediaForm.value.videoMediaLink) {
      this.mediaLinkObj.Links.push({
        Url: this.mediaForm.value.videoMediaLink,
        Type: 'Video'
      });
    }

    if (this.mediaForm.value.floorPlanMediaLink) {
      this.mediaLinkObj.Links.push({
        Url: this.mediaForm.value.floorPlanMediaLink,
        Type: 'FloorPlan'
      });
    }

   this.mediaLinkUpload(this.mediaLinkObj);
    
  }

  mediaLinkUpload(mediaLinks:any){
    this.pl.uploadPropertyMediaLink(mediaLinks).subscribe((mdl: any) => {
      if (mdl.status === 'success') {
        this.toastr.success(mdl.message);
        this.ngOnInit();
      }
    })
  }

  togleInputField(et:any, str:any){
    if(str === 'video'){
      this.toggleFieldVideo = et
    }
    if(str === 'floor'){
      this.toggleFieldFloor = et
    }
  }
}
