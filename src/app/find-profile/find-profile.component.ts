import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import SwiperCore, { Pagination, EffectCreative } from "swiper";
import { SwiperComponent } from 'swiper/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { SignalsService } from '../services/signals.service';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {TranslateService} from '@ngx-translate/core';


SwiperCore.use([Pagination, EffectCreative]);

@Component({
  selector: 'app-find-profile',
  templateUrl: './find-profile.component.html',
  styleUrls: ['./find-profile.component.scss']
})
export class FindProfileComponent implements OnInit {
  progressbarValue: any = 0;
  steps: number = 8;
  currentStep: number = 0;

  inputQuest:any="";
  disbNext:any=0;
  disbPrev:any=0;

  //find-profile
  languageSelected:any="";
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;  
  profileList:any=[];  

  profileChk:any;
  userID:any="";

  title:any=""; 
  description:any="";
  modelName:any="";
  mainProfile:any="";
  subProfile:any="";

  showRecommended:any = 0;
  alertPopup:any=0;
  alertPopupMsg:any="";
  alertPopupImg:any="";

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  threeFormGroup!: FormGroup;
  fourFormGroup!: FormGroup;
  fiveFormGroup!: FormGroup;
  sixFormGroup!: FormGroup;
  sevenFormGroup!: FormGroup;
  eightFormGroup!: FormGroup;
  nineFormGroup!: FormGroup;

  @ViewChild(SwiperComponent) swiper!: SwiperComponent;

  constructor(
    private _signalservice : SignalsService,
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private _formBuilder: FormBuilder,
    private translate: TranslateService, 
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }

    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang');        
    } else {
      this.languageSelected = "EN";      
    }     
    console.log(this.languageSelected);
  }

  ngOnInit() {
    let isLogged = localStorage.getItem("isLogged");      
    if(isLogged=="true"){      
      //CHECKING FOR ALREADY LOADED SIGNAL LIST
      let Jwt_token= localStorage.getItem("Jwt-token");      
      if(Jwt_token==""){        
        this.gotoLogin();
      }

      let obj = {"questID":"", "userID":localStorage.getItem("UserID"), "question1":0, "question2":0, "question3":0, "question4":0, "question5":0, "question6":0, "questionTotal":"", "question7":0, "question8":0, "question9":0, "questionModel":""};
      this.inputQuest=obj;		
      console.log(this.inputQuest);	
      
      //recommended profile
      //CHECKING FOR ALREADY LOADED SIGNAL LIST            
      //this.modelName = localStorage.getItem('profileModel');
      //alert(this.modelName);
      
      /*if(this.modelName=="Conservative"){
        this.title="Conservative Target Allocation";
        this.description="For investors who are predominately risk-averse. Primary focus is on portfolio stability and preservation of capital. Investors using this model should be willing to achieve investment returns (adjusted for inflation) that are low or, in some years, negative, in exchange for reduced risk of principal loss and a high level of liquidity. A typical portfolio will be heavily weighted toward cash and fixed income investments.";
      } else if(this.modelName=="Moderately Conservative"){
        this.title="Moderately Conservative Target Allocation";
        this.description="For investors who are somewhat risk-averse. Primary focus is to achieve a modest level of portfolio appreciation with minimal principal loss and volatility. Investors using this model should be willing to absorb some level of volatility and principal loss. A typical portfolio will include primarily cash and fixed income investments with a modest allocation to equities.";
      } else if(this.modelName=="Moderate"){	
        this.title="Moderate Target Allocation";
        this.description="For investors who are willing to take a moderate level of risk. Primary emphasis is to strike a balance between portfolio stability and portfolio appreciation. Investors using this model should be willing to assume a moderate level of volatility and risk of principal loss. A typical portfolio will primarily include a balance of fixed income and equities.";
      } else if(this.modelName=="Moderately Aggressive"){	
        this.title="Moderately Aggressive Target Allocation";
        this.description="For investors who are willing to take a fair amount of risk. Primary emphasis is on achieving portfolio appreciation over time. Investors using this model should be willing to assume a high level of portfolio volatility and risk of principal loss. A typical portfolio will have exposure to various asset classes but will be primarily weighted toward equities.";
      } else if(this.modelName=="Aggressive"){	
        this.title="Aggressive Target Allocation";
        this.description="For investors who are willing to take substantial risk. Primary emphasis is on achieving above-average portfolio appreciation over time. Investors using this model should be willing to assume a significant level of portfolio volatility and risk of principal loss. A typical portfolio will have exposure to various asset classes but will be heavily weighted toward equities.";
      }            
      this.listAdminProfile();*/
    } else {
      //alert("ELSE");
      this.gotoLogin();
    }

    this.firstFormGroup = this._formBuilder.group({});
    this.secondFormGroup = this._formBuilder.group({});
    this.threeFormGroup = this._formBuilder.group({});
    this.fourFormGroup = this._formBuilder.group({});
    this.fiveFormGroup = this._formBuilder.group({});
    this.sixFormGroup = this._formBuilder.group({});
    this.sevenFormGroup = this._formBuilder.group({});
    this.eightFormGroup = this._formBuilder.group({});
    this.nineFormGroup = this._formBuilder.group({});
  }

  gotoLogin(){
    //alert("Calling");
    this.router.navigate(['/login']);
  }

  nextprogress(){
    const isNextStep = this.currentStep < this.steps;
    if (isNextStep) this.currentStep++;
    this.progressbarValue = (this.currentStep / this.steps) * 100;
    this.swiper.swiperRef.slideNext();
  }

  getValue(event:any,index:any){
    //console.log(event+" "+index);    
    this.inputQuest[index]=event;
    console.log(this.inputQuest);
  }

  swipePrev() {
    this.swiper.swiperRef.slidePrev();
  }

  swipeNext() {
    this.swiper.swiperRef.slideNext();
  }

  gotoRecommendedprofile(){
    this.router.navigate(['/signal/recommended-profile'])
  }

  saveQuestion(){
    //alert("Save In");
    
    this.inputQuest['questionTotal']=parseInt(this.inputQuest['question1'])+parseInt(this.inputQuest['question2'])+parseInt(this.inputQuest['question3'])+parseInt(this.inputQuest['question4'])+parseInt(this.inputQuest['question5'])+parseInt(this.inputQuest['question6']);
    console.log(this.inputQuest);
    //alert(this.inputQuest['questionTotal']);
    var model="";
    if(this.inputQuest['questionTotal']>=6 && this.inputQuest['questionTotal']<=15){
      //alert(1);
  
      if(this.inputQuest['question3']==1){
        model="Conservative";
      } else if(this.inputQuest['question3']==3 || this.inputQuest['question3']==7 || this.inputQuest['question3']==9){
        if(this.inputQuest['question7']==1){
          model="Conservative";
        } else if(this.inputQuest['question7']==2){
          model="Conservative";
        } else if(this.inputQuest['question7']==3){
          model="Moderately Conservative";
        }
      }
    } else if(this.inputQuest['questionTotal']>=16 && this.inputQuest['questionTotal']<=25){
      //alert(2);
      
      if(this.inputQuest['question1']==1){
        if(this.inputQuest['question7']==1){
          model="Conservative";
        } else if(this.inputQuest['question7']==2){
          model="Conservative";
        } else if(this.inputQuest['question7']==3){
          model="Moderately Conservative";
        }
      } else if(this.inputQuest['question1']==3 || this.inputQuest['question1']==5 || this.inputQuest['question1']==7){
        if(this.inputQuest['question7']==1){
          model="Moderately Conservative";
        } else if(this.inputQuest['question7']==2){
          model="Moderately Conservative";
        } else if(this.inputQuest['question7']==3){
          model="Moderately Conservative";
        }
      } else if(this.inputQuest['question1']==9){
        if(this.inputQuest['question7']==1){
          model="Moderately Conservative";
        } else if(this.inputQuest['question7']==2){
          model="Moderately Conservative";
        } else if(this.inputQuest['question7']==3){
          model="Moderate";
        }
      }
    } else if(this.inputQuest['questionTotal']>=26 && this.inputQuest['questionTotal']<=34){
      //alert(3);
  
      if(this.inputQuest['question1']==1 || this.inputQuest['question1']==3){
        if(this.inputQuest['question7']==1){
          model="Moderately Conservative";
        } else if(this.inputQuest['question7']==2){
          model="Moderately Conservative";
        } else if(this.inputQuest['question7']==3){
          model="Moderate";
        }
      } else if(this.inputQuest['question1']==5){
        if(this.inputQuest['question7']==1){
          model="Moderately Conservative";
        } else if(this.inputQuest['question7']==2){
          model="Moderate";
        } else if(this.inputQuest['question7']==3){
          model="Moderate";
        }
      } else if(this.inputQuest['question1']==7 || this.inputQuest['question1']==9){
        if(this.inputQuest['question7']==1){
          model="Moderate";
        } else if(this.inputQuest['question7']==2){
          model="Moderate";
        } else if(this.inputQuest['question7']==3){
          model="Moderately Aggressive";
        }
      }		
    } else if(this.inputQuest['questionTotal']>=35 && this.inputQuest['questionTotal']<=44){
      //alert(4);
  
      if(this.inputQuest['question8']==1){
        if(this.inputQuest['question7']==1){
          model="Moderate";
        } else if(this.inputQuest['question7']==2){
          model="Moderate";
        } else if(this.inputQuest['question7']==3){
          model="Moderately Aggressive";
        }
      } else if(this.inputQuest['question8']==0){
        if(this.inputQuest['question9']==1){
          if(this.inputQuest['question7']==1){
            model="Moderate";
          } else if(this.inputQuest['question7']==2){
            model="Moderately Aggressive";
          } else if(this.inputQuest['question7']==3){
            model="Aggressive";
          }
        } else if(this.inputQuest['question9']==0){
          if(this.inputQuest['question7']==1){
            model="Moderate";
          } else if(this.inputQuest['question7']==2){
            model="Moderate";
          } else if(this.inputQuest['question7']==3){
            model="Moderately Aggressive";
          }
        }
      }		
    } else if(this.inputQuest['questionTotal']>=45 && this.inputQuest['questionTotal']<=54){
      //alert(5);
  
      if(this.inputQuest['question7']==1){
          model="Moderate";
      } else if(this.inputQuest['question7']==2){
        model="Aggressive";
      } else if(this.inputQuest['question7']==3){
        model="Aggressive";
      }		
    }  
    //alert(model);
    this.inputQuest['questionModel']=model;  
    localStorage.setItem('profileModel',model);
    this.showRecommended = 1;    
    //this.router.navigate(['/signal/recommended-profile'])

    this.modelName = model;
      /*if(this.modelName=="Conservative"){
        this.title="Conservative Target Allocation";
        this.description="For investors who are predominately risk-averse. Primary focus is on portfolio stability and preservation of capital. Investors using this model should be willing to achieve investment returns (adjusted for inflation) that are low or, in some years, negative, in exchange for reduced risk of principal loss and a high level of liquidity. A typical portfolio will be heavily weighted toward cash and fixed income investments.";
      } else if(this.modelName=="Moderately Conservative"){
        this.title="Moderately Conservative Target Allocation";
        this.description="For investors who are somewhat risk-averse. Primary focus is to achieve a modest level of portfolio appreciation with minimal principal loss and volatility. Investors using this model should be willing to absorb some level of volatility and principal loss. A typical portfolio will include primarily cash and fixed income investments with a modest allocation to equities.";
      } else if(this.modelName=="Moderate"){	
        this.title="Moderate Target Allocation";
        this.description="For investors who are willing to take a moderate level of risk. Primary emphasis is to strike a balance between portfolio stability and portfolio appreciation. Investors using this model should be willing to assume a moderate level of volatility and risk of principal loss. A typical portfolio will primarily include a balance of fixed income and equities.";
      } else if(this.modelName=="Moderately Aggressive"){	
        this.title="Moderately Aggressive Target Allocation";
        this.description="For investors who are willing to take a fair amount of risk. Primary emphasis is on achieving portfolio appreciation over time. Investors using this model should be willing to assume a high level of portfolio volatility and risk of principal loss. A typical portfolio will have exposure to various asset classes but will be primarily weighted toward equities.";
      } else if(this.modelName=="Aggressive"){	
        this.title="Aggressive Target Allocation";
        this.description="For investors who are willing to take substantial risk. Primary emphasis is on achieving above-average portfolio appreciation over time. Investors using this model should be willing to assume a significant level of portfolio volatility and risk of principal loss. A typical portfolio will have exposure to various asset classes but will be heavily weighted toward equities.";
      }*/
      
      if(this.modelName=="Conservative"){
        this.title=this.translate.instant('find_profile.title1');
        this.description=this.translate.instant('find_profile.desc1');
      } else if(this.modelName=="Moderately Conservative"){
        this.title=this.translate.instant('find_profile.title2');
        this.description=this.translate.instant('find_profile.desc2');
      } else if(this.modelName=="Moderate"){	
        this.title=this.translate.instant('find_profile.title3');
        this.description=this.translate.instant('find_profile.desc3');
      } else if(this.modelName=="Moderately Aggressive"){	
        this.title=this.translate.instant('find_profile.title4');
        this.description=this.translate.instant('find_profile.desc4');
      } else if(this.modelName=="Aggressive"){	
        this.title=this.translate.instant('find_profile.title5');
        this.description=this.translate.instant('find_profile.desc5');
      }
      this.listAdminProfile();
  }

  //recommded profile
  listAdminProfile(){    
    this._signalservice.getAdminProfiles(this.modelName,this.languageSelected)
      .subscribe(
        (result:any) => {
          console.log(result);
          this.profileList = result;
          
          /*for (let i = 0; i < this.profileList.mainProfile.length; i++) {            
            this.profileList.mainProfile[i].profileChk = 1; 
          }*/
          this.profileList.mainProfile.profileChk = 1; 
          console.log(this.profileList.mainProfile);
          this.mainProfile = this.profileList.mainProfile;

          for (let i = 0; i < this.profileList.subProfile.length; i++) {            
            this.profileList.subProfile[i].profileChk = 0; 
          }          
          console.log(this.profileList.subProfile);
          this.subProfile = this.profileList.subProfile;
        },
        (err) => {
          console.log;
        }
      );      
  }
  
  showSignalDets(event:any,profile:any){    
      if(event.target.checked == true){
        profile.profileChk = 1;
      } else {
        profile.profileChk = 0;
      }          
    console.log(profile);
  } 
  
  showSignalDets2(event:any,profile:any){    
    console.log(profile);
    for(let i=0;i<this.subProfile.length;i++){ 
      if(this.subProfile[i].admin_profile_id == profile.admin_profile_id && event.target.checked == true){
        this.subProfile[i].profileChk = 1;
      } else {
        this.subProfile[i].profileChk = 0;
      }          
    }
    console.log(this.subProfile);
  } 

  addProfile(profile:any){
    var userID = localStorage.getItem("UserID");
    let input:any = {userID:userID,profileID:profile.admin_profile_id}; 
    this._signalservice.addAdminProfile(input)
      .subscribe(
        (result:any) => {
          console.log(result); 
          if(result){
            //this._notification.success("Profile Added Successfully");
            this.alertPopup=1;
            //this.alertPopupMsg="Profile Added Successfully"; 
            this.alertPopupMsg=this.translate.instant('find_profile.profile_added');
            this.alertPopupImg="assets/images/validation-error.png";
            //this.router.navigate(['/signal/my-profile']);
            setTimeout(() => {
              this.router.navigate(['/signal/my-profile']);
            }, 2000);
          }         
        },
        (err) => {
          console.log;
        }
      );   
  }

  closeAlertPopup(){
    this.alertPopup = 0;
    this.router.navigate(['/signal/my-profile']);
  }

}
