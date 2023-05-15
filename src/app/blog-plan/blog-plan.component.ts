import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-blog-plan',
  templateUrl: './blog-plan.component.html',
  styleUrls: ['./blog-plan.component.scss']
})
export class BlogPlanComponent implements OnInit {
  languageSelected:any="";
  currCode:any = environment.CurrCode;
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  signalPlanList:any=[];
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
    this.getBlogPlanList();
  }

  getBlogPlanList(){
    //alert("in");    
    let lang:any={langCode:this.languageSelected};
    this._service.getBlogPlanList(lang)
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
      //this.payMsg = "Do you want to buy "+plan.price_user_label+", Click Pay Now.";
      this.translate.get('blog_plan.msg_buy',{title:plan.price_user_label}).subscribe((res: string) => {
        this.payMsg = res;
      });
      this.payBtn=1;          
    } else {      
      this.payMsg = "Current point is insufficient to buy, Click add money to buy more points.";
      this.translate.get('blog_plan.msg_insufficent').subscribe((res: string) => {
        this.payMsg = res;
      })
      this.payBtn=0;
    } 
  }
  closePaynowpopup(){
    this.showPopup = 0;
  }

  saveBlogPayment(){
    this.showPopup = 0;
    let input:any={userID:this.userID,planDets:this.selectedPlan,lang:this.languageSelected};
    console.log(input);      
    this._service.saveBlogPayment(input)
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
            let msg = this.translate.instant('blog_plan.plan_bought');
            //this._notification.success("Spl. Report Plan Bought Successfully.");
            this._notification.success(msg);
            
            //this.getCourseList();    
            this.router.navigate(['/research/market-report']);                                     
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
