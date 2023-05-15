import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignalsService } from '../services/signals.service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-create-profile6',
  templateUrl: './create-profile6.component.html',
  styleUrls: ['./create-profile6.component.scss']
})
export class CreateProfile6Component implements OnInit {

  IMG_URL:string = environment.imgUrl;
  newProfile:Array<any> = [];
  btnNxt:any = 0;  
  submitted = false;

  profile7Form!:FormGroup;
  imageSrc:string="assets/images/choose-img.jpg";

  alertPopup:any=0;
  alertPopupMsg:any="";
  alertPopupImg:any="";


  constructor(
    private router : Router,
    private _service : SignalsService,    
    public _notification: NotificationService,    
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.profile7Form = this.formBuilder.group({             
      profile_name: ['', [Validators.required]],      
      profile_description: [''],     
      profile_image: ['']           
    });

    console.log(this.profile7Form.value);

      let isLogged = localStorage.getItem("isLogged");	
      if(isLogged=="true"){
        //CHECKING FOR ALREADY LOADED SIGNAL LIST
        this.newProfile = JSON.parse(<any>localStorage.getItem('selectedProfile'));
        console.log(this.newProfile);    
        let name = this.newProfile[<any>'name'];
        let description = this.newProfile[<any>'description'];
        let image = this.newProfile[<any>'image'];              

        if(image!=""){
          this.imageSrc = this.IMG_URL+"profiles/"+image;;        
        }
        //alert(this.imageSrc);
        
        this.profile7Form.patchValue({
          profile_name: name,
          profile_description: description,
          profile_image: ''
        }); 
        
        if(name!=""){
          this.btnNxt = 0;
        } else {
          //this.btnNxt = 1;
        }
      } else {        
        this.gotoLogin();
      }
  }

  get valid() { return this.profile7Form.controls; }

  gotoLogin(){
    this.router.navigate(['/home']);
  }

  onFileChange(event:any,image:any) {
    //alert(image);
    const reader = new FileReader();
    console.log(image);
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      console.log(reader);
      reader.onload = () => {
        if(image=='profile_image'){
          this.imageSrc = reader.result as string;
          this.profile7Form.patchValue({
            profile_image: reader.result
          });
        }        
      };
    }
    //console.log(this.profile7Form.value);
  }

  saveProfile(){
    this.submitted = true;
    if (this.profile7Form.invalid) {
        return;
    }
    this.btnNxt = 1;            

    this.newProfile=JSON.parse(<any>localStorage.getItem('selectedProfile'));  
    let name=this.profile7Form.value["profile_name"];
    let description=this.profile7Form.value["profile_description"];
    let image=this.profile7Form.value["profile_image"];

    /*if(name!=""){
      this.btnNxt = 0;
    } else {
      this.btnNxt = 1;
    }*/  

    this.newProfile[<any>'name']=name;
    this.newProfile[<any>'description']=description;
    this.newProfile[<any>'image']=image;
    console.log("Data Select");
    console.log(this.newProfile);		
    localStorage.setItem('selectedProfile',JSON.stringify(this.newProfile));

    let profileDets:any = {profileDets:this.newProfile};
    console.log(profileDets);		

    this._service.saveProfile(profileDets)
      .subscribe(
        (data:any) => {
          console.log(data);
          if(data!=""){
        		localStorage.setItem('profileMode','');
				    localStorage.removeItem("selectedProfile");        
            //this._notification.success("Profile Created/Updated Successfully.");		
            this.alertPopup=1;
            //this.alertPopupMsg="Profile Created/Updated Successfully."; 
            this.alertPopupMsg=this.translate.instant('crtprf_six.success_msg')
            this.alertPopupImg="assets/images/validation-error.png";
            //this.router.navigate(['/signal/my-profile']);
            setTimeout(() => {
              this.router.navigate(['/signal/my-profile']);
            }, 2000);
        	}           
        },
        (err) => {
          console.log(err);
        }
      );
  }

  /*gotoNext(){
    this.router.navigate(['/signal/create-profile7']);
  }*/

  closeAlertPopup(){
    this.alertPopup = 0;
    this.router.navigate(['/signal/my-profile']);
  }
  
}
