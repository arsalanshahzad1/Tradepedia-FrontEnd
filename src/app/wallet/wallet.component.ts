import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PagesService } from '../services/pages.service';
import { Router } from '@angular/router';
import { TranslationComponent } from '../translation/translation.component';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';
import {MatDialog} from '@angular/material/dialog';
//import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  providers: [DatePipe]
})
export class WalletComponent implements OnInit {
  currCode:any = environment.CurrCode;
  userName:any="";
  userPoints:any="";
  chatCount:any=0;
  totalPoints:any="";
  pointsLog:any="";
  userID:any="";

  languageSelected:any="";
  addmoneyPart:any = 0;
  pointPart:any = 0;
  quizSettingID:any="";
  
  referUrl:any = environment.referUrl;
  referralUrl:any = "";

  quizDets:any="";
  senderPoints:any=0;
  receiverPoints:any=0;

  earnPoints:any=0;
  totalRefer:any=0;
  completeRefer:any=0;
  earnedList:any=[];
  referList:any=[];
  selectedType:any="";

  showPart:any=1;
  timeZone:any="";
  showRefer:any=0;

  //transactionPart:any = 1;
  //referralPart:any = 0;

  constructor(
    private router : Router,
    private translate: TranslateService,
    private cookieService: CookieService,
    private _service : PagesService,
    public datepipe: DatePipe,
    public  dialog: MatDialog,
    //private socialSharing: SocialSharing
    private route: ActivatedRoute,
  ) {
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    this.userID = localStorage.getItem("UserID");   
    this.userName = localStorage.getItem("UserName"); 
    this.getUserPoints();

    if(!localStorage.getItem('selectedLang')==false){
      this.languageSelected = localStorage.getItem('selectedLang');        
    } else {
      this.languageSelected = "EN";      
    } 
    console.log(this.languageSelected);

    if(!localStorage.getItem("UserTimezone")==false){
      this.timeZone = localStorage.getItem("UserTimezone");        
    } else {
      this.timeZone="+0000";
    }  

    this._service.getWalletPart.subscribe((lang:any) => {
      this.showPart = lang;
    });

    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false && params['code']=="refer"){
          this.gotoSection(3);                   
        }
    });
  }

  ngOnInit(): void {
    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang');        
    } else {
      this.languageSelected = "EN";      
    } 
    console.log(this.languageSelected);
    
    this.userPoints = localStorage.getItem("UserEarnedPoints"); 
    this.getPointsLog();
    this.getReferSummary();
  }

  readCountry(){      
    let country = localStorage.getItem("UserCountry");
    this._service.getReferCountries(country)
    .subscribe(
      (data:any) => {
        console.log("Post Reuslt => ", data); 
        if(data[0]=="ALL"){
          this.showRefer=1;
        } else if(data.includes(country)){
          this.showRefer=1;
        } else {
          this.showRefer=0;
        }      
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }
  getPointsLog(){
    //alert("in");    
    let userDets:any={userID:this.userID,limit:8,lang:this.languageSelected};
    this._service.getPointsLog(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.pointsLog = data.pointsLog; 
        this.senderPoints = data.senderPoints;
        this.receiverPoints = data.receiverPoints;    
        this.quizSettingID = data.quizSettingID;  
        this.quizDets = data.quizDets;  
        
        for(let i=0;i<this.pointsLog.length;i++){
          this.pointsLog[i].base_date2 = (this.pointsLog[i].base_date.replace(" ","T"))+"Z";
        }                        
        console.log(this.pointsLog);        
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  gotoSection(input:any){
    //this.showPart = input;
    this._service.setWalletPart(input);
  }  

  /*showTransbtn(){
    this.transactionPart = 1;
    this.referralPart = 0;
  }

  showreferralsbtn(){
    this.transactionPart = 0;
    this.referralPart = 1;
  }*/

  gotoBuy(){
    /*this.transactionPart = 0;
    this.addmoneyPart = 1;
    this.pointPart = 0;*/
    this.router.navigate(['/add-money']);
  }

  gotoTransfer(){
    /*this.transactionPart = 0;
    this.addmoneyPart = 0;
    this.pointPart = 1;*/
    this.router.navigate(['/share-points']);
  }

  gotoQuiz(){
    //alert(this.quizSettingID);
    console.log(this.quizSettingID);
    let url:any='quiz/Extra/'+this.quizSettingID+'/'+this.languageSelected;
    //alert(url);
    this.router.navigate([url]);
  }

  shareReferal(templateRef: TemplateRef<any>){
    //this._bottomSheet.open(this.TemplateBottomSheet);
    this.dialog.open(templateRef);
    this.referralUrl="";
    let date=new Date();
    let dat = this.datepipe.transform(date, 'yyyyMMdd');
    let param:any = (this.userName).replaceAll(" ","")+"_"+this.userID+"_"+dat;
    this.referralUrl = this.referUrl+param;
  }

  /*shareReferal(){
    //this._bottomSheet.open(this.TemplateBottomSheet);
    //alert("In");
    this.referralUrl="";
    let date=new Date();
    let dat = this.datepipe.transform(date, 'yyyyMMdd');
    let param:any = (this.userName).replaceAll(" ","")+"_"+this.userID+"_"+dat;
    this.referralUrl = this.referUrl+param;
    console.log(this.referralUrl);
    //this.socialSharing.share('You are invited to Tradepedia by your Friend. Click to signup and earn Free '+this.receiverPoints+' '+this.currCode, 'Referral Program', undefined, this.referralUrl);
  }*/

  getUserPoints(){    
    let input:any={userID:this.userID,userType:localStorage.getItem("UserType")};
    this._service.getUserPoints(input)
      .subscribe(
        (result:any) => {
          console.log("Current User Points"); 
          console.log(result);      
          this.userPoints = result.userPoints;
          localStorage.setItem("UserEarnedPoints",<any>parseFloat(this.userPoints));  
          this._service.setUserPoints(this.userPoints);   

          this.chatCount=result.unreadTotalCount;
          localStorage.setItem("TotalChatCount",<any>parseFloat(this.chatCount));
          this._service.setChatCount(this.chatCount);
        },
        (err) => {
          console.log;
        }
      );
  }

  getReferSummary(){
    //alert("in");    
    let userDets:any={userID:this.userID,lang:this.languageSelected,limit:30};
    this._service.getReferSummary(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data); 
        if(!data.totalEarns==false){
          this.earnPoints = data.totalEarns;
        }       
        
        this.totalRefer = data.totalUser;
        this.completeRefer = data.compUser;
        
        this.earnedList = data.tnxList;
        this.referList = data.referList;   
        
        for(let i=0;i<this.earnedList.length;i++){
          this.earnedList[i].base_date2 = (this.earnedList[i].base_date.replace(" ","T"))+"Z";
        }                
        
        for(let i=0;i<this.referList.length;i++){
          this.referList[i].base_date2 = (this.referList[i].base_date.replace(" ","T"))+"Z";
        }   
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  showStatus(event:any){
    console.log(event);
    this.selectedType = event;
  }

  filterFunction(arrlist: any[],type:any): any {  
    if (!arrlist || !type) {
        return arrlist;
    }    
    return arrlist.filter((item:any) => item.refer_status.indexOf(type) !== -1);
  }

}
