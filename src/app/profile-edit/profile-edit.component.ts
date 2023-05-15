import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SignalsService } from '../services/signals.service';
import { PagesService } from '../services/pages.service';
import { environment } from '../../environments/environment';
import { NotificationService } from '../services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  API_URL:string = environment.apiUrl;    
  IMG_URL:string = environment.imgUrl;
  imageSrc:string="assets/images/choose-img.svg";

  profileEditForm!: FormGroup;
  submitted = false;
  btnDis:number = 0;

  hide:boolean = true;

  userID:any="";
  userDets:any=[];
  subscriptDets:any=[];
  toolsExpList:any=[];
  languageSelected:any="";
  timeZoneList:any=[];  
  langList:any=[];
  countryList:any=[];    

  constructor(
    private _service : SignalsService, 
    private _pgservice : PagesService,
    private router : Router, 
    private formBuilder: FormBuilder,
    public _notification: NotificationService,
    private translate: TranslateService,
    private cookieService: CookieService,    
    public dialog: MatDialog
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    let lang="";
    if(!this.cookieService.get('selectedLang')==true){
      this.cookieService.set('selectedLang','en'); 
      this.translate.use('en');
    } else {
      lang=this.cookieService.get('selectedLang');
      this.translate.use(lang);
    }

    if(!this.cookieService.get('languageListArr')==false){
      this.langList = JSON.parse(this.cookieService.get('languageListArr')); 
      console.log(this.langList); 
    } else {
      this.getLangList();
    }    
    console.log(this.langList);
    
    this.userID = localStorage.getItem("UserID");
    this.getUserProfile();
    this.getCountryList();
  }

  ngOnInit(): void {    
    this.profileEditForm = this.formBuilder.group({                       
        userID: [''],
        mailid: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        username: ['', [Validators.required]],        
        firstname: ['',[Validators.required]],
        lastname: ['',[Validators.required]],
        age: ['',[Validators.required,Validators.min(1)]],
        gender: [''],
        country: ['', [Validators.required]],
        language: [this.languageSelected],
        timezone: [''],
        user_image: ['']        
    });

    this.getSubscriptDets();
  }

  get valid() { return this.profileEditForm.controls; }

  getCountryLang(){
    let country:any=this.profileEditForm.value['country'];     
    //alert(country);
    for(let i=0;i<this.countryList.length;i++){
      if(this.countryList[i].country_2code == country){
        //alert(this.countryList[i].country_language);
        this.timeZoneList = this.countryList[i].timezoneArr;
        this.profileEditForm.patchValue({                    
          language: this.countryList[i].country_language,
          timezone: this.timeZoneList[0].ctz_value                                      
        });
        break;
      }
    }
  }


  getCountryList(){          
    let input:any=[];    
    this._pgservice.getCountryList(input)
    .subscribe(
      (data) => {
        console.log("Country Reuslt => ", data);
        console.log(data);    
        this.countryList = data.countryList;      
        for(let i=0;i<this.countryList.length;i++){
          if(this.countryList[i].country_2code == this.profileEditForm.value['country']){
            this.timeZoneList = this.countryList[i].timezoneArr;
            this.profileEditForm.patchValue({                    
              timezone: this.timeZoneList[0].ctz_value                
            });
          }
        }
        console.log(this.timeZoneList)        
      },
      response => {        
        console.log("POST call in error", response);                              
      });
  }

  getLangList(){
    //alert("in");    
    this._pgservice.getLangList()
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.langList = data.langList;                           
        console.log(this.langList);
        localStorage.setItem('languageListArr',JSON.stringify(this.langList));
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  getUserProfile(){
    //alert("in");    
    let userDets:any={userID:this.userID};
    this._service.getUserProfile(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.userDets = data.userDets;                           
        console.log(this.userDets);  
        let image = this.userDets.user_image;
        if(image!=""){
          this.imageSrc = this.IMG_URL+"users/"+image;;        
        }

        let currLang:any="";
        if(!this.userDets.user_curr_lang==false){
          currLang = this.userDets.user_curr_lang;
        } else {
          currLang = this.languageSelected;
        }
                
        this.profileEditForm.patchValue({                    
            userID: this.userDets.user_id,
            mailid: this.userDets.user_email,
            username: this.userDets.user_username,        
            firstname: this.userDets.user_firstname,
            lastname: this.userDets.user_lastname,
            age: this.userDets.user_age,
            gender: this.userDets.user_gender,
            country: this.userDets.user_country,
            language: currLang,
            timezone: this.userDets.user_timezone,
            user_image:''       
        });

        for(let i=0;i<this.countryList.length;i++){
          if(this.countryList[i].country_2code == this.userDets.user_country){            
            this.timeZoneList = this.countryList[i].timezoneArr;
            this.profileEditForm.patchValue({                    
                timezone: this.timeZoneList[0].ctz_value                
            });
          }
        }
      },
      response => {
        console.log("POST call in error", response);                              
      });
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
        if(image=='user_image'){
          this.imageSrc = reader.result as string;
          this.profileEditForm.patchValue({
            user_image: reader.result
          });
        }        
      };
    }
    //console.log(this.profile7Form.value);
  }
  
  saveUser(){
    //alert("In");
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileEditForm.invalid) {
        return;
    }
    this.btnDis = 1;
    console.log(this.profileEditForm.value); 
        
    //this._notification.longMsg("User Update going on, Please wait.");
    this._notification.longMsg(this.translate.instant('profile_edit.update_process')); 
    let userDet:any=this.profileEditForm.value;
    console.log(userDet);
    this._service.updateUser(userDet)
      .subscribe(
        (data:any) => {
          console.log(data);                    
          let result = data;
          this.btnDis = 0;
          if(result.status==true){                        	            
            //this._notification.success("User Updated Successfully.");   
            this._notification.success(this.translate.instant('profile_edit.update_success'));               
            
            this.userDets = result.userDets;                           
            console.log(this.userDets);      
            let name:any=this.userDets.user_firstname+" "+this.userDets.user_lastname;  
            let image:any='./assets/images/avatar.jpg';
            if(!this.userDets.user_image==false){
              image = this.IMG_URL+"users/"+this.userDets.user_image;        
            }

            localStorage.setItem("UserName",name);
            localStorage.setItem("EmailID",this.userDets.user_email);
            localStorage.setItem("UserImage",this.userDets.user_image);

            this._pgservice.setUserPoints(name);
            this._pgservice.setUserImage(image);

            this.profileEditForm.patchValue({                    
                userID: this.userDets.user_id,
                mailid: this.userDets.user_email,
                username: this.userDets.user_username,        
                firstname: this.userDets.user_firstname,
                lastname: this.userDets.user_lastname,
                age: this.userDets.user_age,
                gender: this.userDets.user_gender,
                country: this.userDets.user_country,
                language: this.userDets.user_curr_lang,
                timezone: this.userDets.user_timezone              
            });
          }
        },
        (err:any) => {
          this.btnDis = 0;
          console.log(err);
        }
      );      
  }

  gotoHome(){
    this.router.navigate(['/home']);
  }
    
  resetFormGroup(){
    this.submitted = false;
    this.profileEditForm.reset();
  }

  //Subscription

  getSubscriptDets(){
    //alert("in");    
    let lang=this.cookieService.get('selectedLang');
    let userDets:any={userID:this.userID, lang:lang};
    this._service.getSubscriptDets(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.subscriptDets = data.subscriptDets;  
        this.toolsExpList = data.userToolsExpiry;      
        console.log(this.subscriptDets);    
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  enableAutoRenewal(event:any,type:any){
    //alert(event.checked)
    console.log(type);
    if(type=="signal" && event.checked == true){
      this.subscriptDets.user_signal_auto = 1;
    } else if(type=="signal" && event.checked == false){
      this.subscriptDets.user_signal_auto = 0;
    }

    if(type=="report" && event.checked == true){
      this.subscriptDets.user_splrpt_auto = 1;
    } else if(type=="report" && event.checked == false){
      this.subscriptDets.user_splrpt_auto = 0;
    }
    console.log(this.subscriptDets); 

    let status:any=0;
    if(event.checked==true){
      status = 1;
    }

    let userDets:any={userID:this.userID, type:type, status:status};
    console.log(userDets); 
    this._service.enableAutoRenewal(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);   
        this.subscriptDets = data.subscriptDets;             
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  enableToolsAutoRenewal(event:any,tools:any){
    //alert(event.checked)
    console.log(tools);
    tools.usrtools_auto = 1; 

    let status:any=0;
    if(event.checked==true){
      status = 1;
    }
    let lang=this.cookieService.get('selectedLang');
    let userDets:any={userID:this.userID, toolID:tools.usrtools_tools_id, status:status, lang:lang};
    console.log(userDets); 
    this._service.enableToolsAutoRenewal(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data); 
        this.toolsExpList = data.userToolsExpiry;               
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  cancelSubPlan(type:any){
    console.log(type);    
    let userDets:any={userID:this.userID, type:type};
    console.log(userDets); 
    this._service.cancelSubPlan(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);   
        this.subscriptDets = data.subscriptDets;              
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  cancelSubTools(tools:any){
    console.log(tools);    
    let lang=this.cookieService.get('selectedLang');
    let userDets:any={userID:this.userID, toolID:tools.usrtools_tools_id, lang:lang};
    console.log(userDets); 
    this._service.cancelSubTools(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);   
        this.toolsExpList = data.userToolsExpiry;              
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  gotoTools(toolsID:any){
    console.log(toolsID);
    let lang=this.cookieService.get('selectedLang');         
    this.router.navigate(['/tools/'+toolsID+'/'+lang]);
  }

  gotoHSC(){    
    //alert("Calling");    
    this.router.navigate(['/academy/hsc-chapter-list']);
  }  

  gotoPage(url:any){
    if(url=="signalPlan"){
      this.router.navigate(['/signal-plan']);
    } else if(url=="reportPlan"){
      this.router.navigate(['/blog-plan']);
    } else {
      this.router.navigate([url]);
    }
  }

}
