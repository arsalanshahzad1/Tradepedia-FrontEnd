import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SignalsService } from '../services/signals.service';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-signal-plan',
  templateUrl: './signal-plan.component.html',
  styleUrls: ['./signal-plan.component.scss']
})
export class SignalPlanComponent implements OnInit {
  languageSelected:any="";
  currCode:any = environment.CurrCode;
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  signalPlanList:any=[];
  userID:any="";
  userPoints:any="";
  chatCount:any=0;
  planCost:any=0;
  payBtn:any=0;
  payMsg:any="";
  selectedPlan:any="";

  constructor(
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private _sigservice : SignalsService,
    private translate: TranslateService,
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    if(!localStorage.getItem("UserID")==false){
      this.userID =localStorage.getItem("UserID");        
    }
    this.getUserPoints(); 

    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang');        
    } else {
      this.languageSelected = "EN";      
    } 
    
    console.log(this.languageSelected);
  }

  ngOnInit(): void {
    this.userPoints = localStorage.getItem("UserEarnedPoints"); 
    this.getSignalPlanList();
  }

  getSignalPlanList(){
    //alert("in");    
    let lang:any={langCode:this.languageSelected};
    this._service.getSignalPlanList(lang)
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
    /*if(parseFloat(this.planCost) <= parseFloat(this.userPoints)){      
      this.payMsg = "Do you want to buy "+plan.price_user_label+", Click Pay Now.";
      this.payBtn=1;          
    } else {      
      this.payMsg = "Current point is insufficient to buy, Click add money to buy more points.";
      this.payBtn=0;
    }*/
    
    if(parseFloat(this.planCost) <= parseFloat(this.userPoints)){      
      //this.payMsg = "Do you want to buy "+plan.price_user_label+", Click Pay Now.";
      this.payMsg = this.translate.instant('signal_plan.plan_want_buy',{label:plan.price_user_label});
      this.payBtn=1;          
    } else {      
      //this.payMsg = "Current point is insufficient to buy, Click add money to buy more points.";
      this.payMsg = this.translate.instant('signal_plan.plan_insufficient_buy');
      this.payBtn=0;
    }
  }
  closePaynowpopup(){
    this.showPopup = 0;
  }

  saveSignalPayment(){
    this.showPopup = 0;
    let input:any={userID:this.userID,planDets:this.selectedPlan,lang:this.languageSelected};
    console.log(input);      
    this._service.saveSignalPayment(input)
      .subscribe(
        (result:any) => {
          console.log(result);
          if(result.paymentID!=""){
            this.userPoints = result.userPoints;
            localStorage.setItem("UserEarnedPoints",<any>parseFloat(this.userPoints));  
            this._service.setUserPoints(this.userPoints); 

            this.chatCount=result.unreadTotalCount
            localStorage.setItem("TotalChatCount",<any>parseFloat(this.chatCount));
            this._service.setChatCount(this.chatCount);
            
            //this._notification.success("Signal Plan Bought Successfully.");
            let msg:any = this.translate.instant('signal_plan.plan_bought');
            this._notification.success(msg);
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

    this._sigservice.updatePayment(paymentDets)
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
        },
        (err) => {
          console.log;
        }
      );
  }

}
