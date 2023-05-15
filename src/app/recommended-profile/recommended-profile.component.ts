import { Component, OnInit } from '@angular/core';
import { SignalsService } from '../services/signals.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-recommended-profile',
  templateUrl: './recommended-profile.component.html',
  styleUrls: ['./recommended-profile.component.scss']
})
export class RecommendedProfileComponent implements OnInit {

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

  constructor(
    private _service : SignalsService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
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

    if(!localStorage.getItem("UserID")==false){
      this.userID = localStorage.getItem("UserID");        
    }
  }

  ngOnInit(): void {
    let isLogged = localStorage.getItem("isLogged");      
    if(isLogged=="true"){      
      //CHECKING FOR ALREADY LOADED SIGNAL LIST            
      this.modelName = localStorage.getItem('profileModel');
      //alert(this.modelName);
      
      if(this.modelName=="Conservative"){
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
      this.listAdminProfile();          
    } else {
      this.gotoLogin();
    }    
  }

  gotoLogin(){
    //alert("Calling");
    this.router.navigate(['/login']);
  }

  listAdminProfile(){    
    this._service.getAdminProfiles(this.modelName,this.languageSelected)
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
    this._service.addAdminProfile(input)
      .subscribe(
        (result:any) => {
          console.log(result); 
          if(result){
            this._notification.success("Profile Added Successfully");
            this.router.navigate(['/signal/my-profile']);
          }         
        },
        (err) => {
          console.log;
        }
      );   
  }
}
