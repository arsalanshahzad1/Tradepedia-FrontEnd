import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PagesService } from '../services/pages.service';
import { Router } from '@angular/router';
import { TranslationComponent } from '../translation/translation.component';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';

//import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.component.html',
  styleUrls: ['./add-money.component.scss']
})
export class AddMoneyComponent implements OnInit {
  currCode:any = environment.CurrCode;
  stripeKey:any = environment.stripeKey;
  languageSelected:any="";

  userID:any="";
  userPoints:any="";  
  buyAmount:any="";
  receivePoints:any="";  
  btnStatus:any=0;

  rcPlansList:any=[];
  paymentHandler:any = null;

  msgPopup:any=0;
  xmacno:any="";
  xmacurl:any="";
  
  constructor(
    private router : Router,
    private translate: TranslateService,
    private cookieService: CookieService,
    public _notification: NotificationService,
    private _service : PagesService,
    //private iab: InAppBrowser,
  ) {
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    this.userID = localStorage.getItem("UserID");   
    this.userPoints = localStorage.getItem("UserEarnedPoints");

    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang');        
    } else {
      this.languageSelected = "EN";      
    } 
    
    console.log(this.languageSelected);
  }

  ngOnInit(): void {
    this.initStripe();
    this.getRCPlanList();
    this.getExternalLink();
  }

  getRCPlanList(){
    //alert("in");    
    let lang:any={langCode:this.languageSelected};    
    this._service.getRCPlanList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.rcPlansList = data.rcPlanList;  
        for(let i=0;i<this.rcPlansList.length;i++){
          this.rcPlansList[i].showStatus = 0;
          this.rcPlansList[i].buyPrice = "$"+(this.rcPlansList[i].plan_rate);
          this.rcPlansList[i].buyCurrency = "USD";
        }                          
        console.log(this.rcPlansList);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }   

  makePayment(planDets:any) {
    console.log(planDets)
    this.paymentHandler = null;
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.stripeKey,
      locale: 'auto',
      token: (stripeToken: any) => {
        console.log(stripeToken)
        //alert('Stripe token generated!');
        if(!stripeToken==false){
          for(let i=0;i<this.rcPlansList.length;i++){
            this.rcPlansList[i].showStatus = 1;
          } 
          let desc=localStorage.getItem("UserName")+" bought plan - "+planDets.plan_title;
          let input:any={userID:this.userID,desc:desc,planDets:planDets,paymentDets:stripeToken};
          console.log(input);
          localStorage.setItem("paymentDets",JSON.stringify(input));               
          this.router.navigate(['/home/payment-process']);
        }        
      }
    });

    console.log(paymentHandler);
  
    paymentHandler.open({
      name: 'Tradepedia',      
      description: 'Make payments for buy points',
      amount: planDets.plan_rate * 100
    });
  }
  
  initStripe() {
    if(!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement("script");
      script.id = "stripe-script";
      script.type = "text/javascript";
      script.src = "https://checkout.stripe.com/checkout.js";
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.stripeKey,
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken)
            //alert('Payment has been successfull!');
          }
        });
      }
        
      window.document.body.appendChild(script);
    }
  }    

  openXmPopup(){
    this.msgPopup = 1; 
  }

  closeMsgPopup(){
    this.msgPopup = 0;
  }

  registerXmcode(){
    //alert(this.xmacno);
    this.userID = localStorage.getItem("UserID");
    let input:any={userID:this.userID,xmacno:this.xmacno};
    console.log(input);   
    this._service.registerXmcode(input)
      .subscribe(
        (result: any) => {
          console.log(result);
          //this.btnStatus = 0;  
          if(result.transID!=""){
            this._notification.success("XM Account Registered Successfully.");
            this.closeMsgPopup();
          }        
        },
        (err) => {
          this.btnStatus = 0;
          console.log;
        }
      );
  }

  openExternalLink(url:string){
    console.log("Opening External Link");
    //const browser = this.iab.create(url, '_system', '**hidden=yes**,location=yes');    
    window.open(url, "_blank");
  }

  getExternalLink(){
    let country = localStorage.getItem("UserCountry");
    this._service.getXMAccURL(country)
      .subscribe(
        (result: any) => {
          console.log(result);          
          this.xmacurl = result.url;          
          //alert(this.xmacurl);
        },
        (err) => {
          this.btnStatus = 0;
          console.log;
        }
      );
  }

}

