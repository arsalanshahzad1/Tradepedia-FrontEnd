import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { SignalsService } from '../services/signals.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-my-subscriptions',
  templateUrl: './my-subscriptions.component.html',
  styleUrls: ['./my-subscriptions.component.scss']
})
export class MySubscriptionsComponent implements OnInit {

  userID:any="";
  subscriptDets:any=[];
  toolsExpList:any=[];
  languageSelected:any="";

  //Signal Plan
  currCode:any = environment.CurrCode;
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  signalPlanList:any=[];
  blogPlanList:any=[];
  userPoints:any="";

  planCost:any=0;
  payBtn:any=0;
  payMsg:any="";
  selectedPlan:any="";
  btnDis:any=0;
  //type:any="signalPlan";
  type:any="";
  timeZone:any="";

  constructor(
    private _service : SignalsService,
    private _pageservice : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    if(!localStorage.getItem("UserID")==false){
      this.userID = localStorage.getItem("UserID");        
    }

    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang');        
    } else {
      this.languageSelected = "EN";      
    } 
    console.log(this.languageSelected);

    if(!localStorage.getItem("UserTimezone")==false){
      this.timeZone = localStorage.getItem("UserTimezone");        
    } else {
      this.timeZone="+0000";
    }  
  }

  ngOnInit(): void {
    this.getSubscriptDets();
    // Signal Plan
    //this.getSignalPlanList();
    // Blog Plan
    //this.getBlogPlanList();
  }
  
  getSubscriptDets(){
    //alert("in");    
    let lang=this.cookieService.get('selectedLang');
    let userDets:any={userID:this.userID, lang:lang};
    this._service.getSubscriptDets(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.subscriptDets = data.subscriptDets;  

        this.subscriptDets.user_signal_expired2 = (this.subscriptDets.user_signal_expired.replace(" ","T"))+"Z";
        this.subscriptDets.user_splrpt_expired2 = (this.subscriptDets.user_splrpt_expired.replace(" ","T"))+"Z";
        this.subscriptDets.user_squawk_expired2 = (this.subscriptDets.user_squawk_expired.replace(" ","T"))+"Z";

        this.toolsExpList = data.userToolsExpiry;      
        for(let i=0;i<this.toolsExpList.length;i++){
          this.toolsExpList[i].usrtools_expiry_on2 = (this.toolsExpList[i].usrtools_expiry_on.replace(" ","T"))+"Z";
        }
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

    if(type=="squawk" && event.user_squawk_auto == true){
      this.subscriptDets.user_splrpt_auto = 1;
    } else if(type=="squawk" && event.checked == false){
      this.subscriptDets.user_squawk_auto = 0;
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
        
        this.subscriptDets.user_signal_expired2 = (this.subscriptDets.user_signal_expired.replace(" ","T"))+"Z";
        this.subscriptDets.user_splrpt_expired2 = (this.subscriptDets.user_splrpt_expired.replace(" ","T"))+"Z";
        this.subscriptDets.user_squawk_expired2 = (this.subscriptDets.user_squawk_expired.replace(" ","T"))+"Z";

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
        for(let i=0;i<this.toolsExpList.length;i++){
          this.toolsExpList[i].usrtools_expiry_on2 = (this.toolsExpList[i].usrtools_expiry_on.replace(" ","T"))+"Z";
        }           
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
        this.subscriptDets = data.subscriptDets; this.subscriptDets.user_signal_expired2 = (this.subscriptDets.user_signal_expired.replace(" ","T"))+"Z";
        this.subscriptDets.user_splrpt_expired2 = (this.subscriptDets.user_splrpt_expired.replace(" ","T"))+"Z";
        this.subscriptDets.user_squawk_expired2 = (this.subscriptDets.user_squawk_expired.replace(" ","T"))+"Z";             
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
        for(let i=0;i<this.toolsExpList.length;i++){
          this.toolsExpList[i].usrtools_expiry_on2 = (this.toolsExpList[i].usrtools_expiry_on.replace(" ","T"))+"Z";
        }            
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  gotoTools(tools:any){
    console.log(tools);
    let lang=this.cookieService.get('selectedLang');         
    this.router.navigate(['/tools/'+tools.tools_type+'/'+tools.usrtools_tools_id+'/'+lang]);
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
    } else if(url=="squawkPlan"){
      this.router.navigate(['/squawk-plan']);
    } else {
      this.router.navigate([url]);
    }
    
    //this.type = url;
  }

  // Signal Plan
  /*getSignalPlanList(){
    //alert("in");    
    let lang:any={langCode:this.languageSelected};
    this._pageservice.getSignalPlanList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.signalPlanList = data.signalPlanList;                            
        console.log(this.signalPlanList);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  } 


  showPopup = 0;
  gotoPaynowPopup(plan:any){
    console.log(plan);
    this.showPopup = 1;
    this.selectedPlan = plan;
    this.planCost = plan.price_rate;

    //this.userPoints = 20;    
    this.payMsg = "";
    this.payBtn = 0;    
    if(parseFloat(this.planCost) <= parseFloat(this.userPoints)){      
      this.payMsg = "Do you want to buy "+plan.price_user_label+", Click Pay Now.";
      this.payBtn=1;          
    } else {      
      this.payMsg = "Current point is insufficient to buy, Click add money to buy more points.";
      this.payBtn=0;
    } 
  }
  closePaynowpopup(){
    this.showPopup = 0;
  }

  saveSignalPayment(){
    this.btnDis = 1;
    this.showPopup = 0;    
    let input:any={userID:this.userID,planDets:this.selectedPlan};
    console.log(input);      
    this._pageservice.saveSignalPayment(input)
      .subscribe(
        (result:any) => {
          console.log(result);
          if(result.paymentID!=""){
            this.userPoints = result.userPoints;
            localStorage.setItem("UserEarnedPoints",<any>parseFloat(this.userPoints));  
            this._pageservice.setUserPoints(this.userPoints); 
            this._notification.success("Signal Plan Bought Successfully.");
            //this.getCourseList();  
            this.updatePaymentStatus(this.selectedPlan,result);  
            //this.router.navigate(['/signal/autotrade']);                                     
          }
        },
        (err) => {
          console.log;
        }
      );
  }

  updatePaymentStatus(planDets:any,inputDets:any){
    let userName =localStorage.getItem("username");
    let transID:any=this.randomString()+"-"+inputDets.paymentID;

    let paymentDets:any = {
      "username": userName,
      "amount": planDets.price_rate,
      "currency": "USD",
      "platform": "android",
      "product_name": planDets.price_user_label,
      "product_id": planDets.price_id,
      "billing_period": planDets.price_month+" months",
      "expiry_date": inputDets.userExpiry,
      "auto_renewal": false,
      "payment_state": "success",
      "transaction_id": transID,
      "old_payment_id": null,
      "cancel_reason": null,
      "transaction_type": "PAYMENT"
    };
    console.log(paymentDets);

    this._service.updatePayment(paymentDets)
      .subscribe(
        (result:any) => {
          console.log(result);
          this.router.navigate(['/signal/autotrade']);  
        },
        (err) => {
          console.log;
        }
      );
  }

  randomString() {
    let result = '';
    let chars:any="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let length:any=16;
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  gotoAddMoney(){
    this.router.navigate(['/add-money']);
  }

  //Blog Plan
  getBlogPlanList(){
    //alert("in");    
    let lang:any={langCode:this.languageSelected};
    this._pageservice.getBlogPlanList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.blogPlanList = data.signalPlanList;                            
        console.log(this.blogPlanList);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  saveBlogPayment(){
    this.btnDis = 1;
    this.showPopup = 0;    
    let input:any={userID:this.userID,planDets:this.selectedPlan};
    console.log(input);      
    this._pageservice.saveBlogPayment(input)
      .subscribe(
        (result:any) => {
          console.log(result);
          if(result.paymentID!=""){
            this.userPoints = result.userPoints;
            localStorage.setItem("UserEarnedPoints",<any>parseFloat(this.userPoints));  
            this._pageservice.setUserPoints(this.userPoints); 
            this._notification.success("Spl. Report Plan Bought Successfully.");
            //this.getCourseList();    
            this.router.navigate(['/research/market-report']);                                     
          }
        },
        (err) => {
          console.log;
        }
      );
  }*/

}
