import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-squawk-room-plan',
  templateUrl: './squawk-room-plan.component.html',
  styleUrls: ['./squawk-room-plan.component.scss']
})
export class SquawkRoomPlanComponent implements OnInit {
  languageSelected:any="";
  currCode:any = environment.CurrCode;
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  squawkPlanList:any=[];
  userID:any="";
  userPoints:any="";
  chatCount:any="";
  planCost:any=0;
  payBtn:any=0;
  payMsg:any="";
  selectedPlan:any="";

  constructor(
    private _service : PagesService,
    private translate: TranslateService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
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
    this.getSquawkPlanList();
  }

  getSquawkPlanList(){
    //alert("in");    
    let lang:any={langCode:this.languageSelected};
    this._service.getSquawkPlanList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.squawkPlanList = data.squawkPlanList;                            
        console.log(this.squawkPlanList);
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
      //this.payMsg = "Do you want to buy "+plan.price_user_label+", Click Pay Now.";
      this.translate.get('squawk_plan.plan_want_buy',{label:plan.price_user_label}).subscribe((res: string) => {
        this.payMsg = res;
      });
      this.payBtn=1;          
    } else {      
      this.payMsg = "Current point is insufficient to buy, Click add money to buy more points.";
      this.translate.get('squawk_plan.plan_insufficient_buy').subscribe((res: string) => {
        this.payMsg = res;
      })
      this.payBtn=0;
    } 
  }
  closePaynowpopup(){
    this.showPopup = 0;
  }

  saveSquawkPayment(){
    this.showPopup = 0;
    let input:any={userID:this.userID,planDets:this.selectedPlan,lang:this.languageSelected};
    console.log(input);      
    this._service.saveSquawkPayment(input)
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
            let msg = this.translate.instant('squawk_plan.plan_bought');
            //this._notification.success("Spl. Report Plan Bought Successfully.");
            this._notification.success(msg);
            
            //this.getCourseList();    
            this.router.navigate(['/research/squawk-room']);                                      
          }
        },
        (err) => {
          console.log;
        }
      );
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
