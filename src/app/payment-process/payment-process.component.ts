import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PagesService } from '../services/pages.service';
import { Router } from '@angular/router';
import { TranslationComponent } from '../translation/translation.component';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-payment-process',
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.scss']
})
export class PaymentProcessComponent implements OnInit {

  userID:any="";
  userPoints:any="";    

  constructor(
    private router : Router,
    private translate: TranslateService,
    private cookieService: CookieService,
    public _notification: NotificationService,
    private _service : PagesService
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    this.userID = localStorage.getItem("UserID");   
    this.userPoints = localStorage.getItem("UserEarnedPoints");
  }

  ngOnInit(): void {
    if(!localStorage.getItem("paymentDets")==false){
      let paymentDets:any = JSON.parse(<any>localStorage.getItem("paymentDets"));
      this.makeStripePayment(paymentDets);
    }
  }

  makeStripePayment(paymentDets:any){        
    console.log(paymentDets);          
    this._service.makeStripePayment(paymentDets)
      .subscribe(
        (result:any) => {
          console.log(result);             
          if(result.transID!=""){
            this.userPoints = result.userPoints;
            localStorage.setItem("UserEarnedPoints",<any>parseFloat(this.userPoints));  
            this._service.setUserPoints(this.userPoints); 
            this._notification.success("Payment Completed, Points Added Successfully.");
            this.router.navigate(['/wallet']);       	                          
          }                  
        },
        (err) => {          
          console.log;
        }
      );
  }

}
