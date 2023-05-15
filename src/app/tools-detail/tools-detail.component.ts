import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-tools-detail',
  templateUrl: './tools-detail.component.html',
  styleUrls: ['./tools-detail.component.scss']
})
export class ToolsDetailComponent implements OnInit {
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  currCode:any = environment.CurrCode;
  
  langCode:any="";
  toolsID:any="";  
  toolsDets:any="";
  toolsPayStatus:number=0;    
  exeName:any="";
  userID:any="";
  userPoints:any="";
  chatCount:any=0;
  userTools:any="";
  userToolsCost:any="";
  showPopup = 0;
  payBtn:any=0;
  payMsg:any="";
  
  constructor(
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    if(!localStorage.getItem("UserID")==false){
      this.userID =localStorage.getItem("UserID");        
    }
    this.getUserPoints();
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false){
          //this.getCouponDets(params['code']);
          this.toolsID=params['code'];
          this.langCode=params['lang'];
          this.getToolsDets();          
        }
    });

    this.userPoints = localStorage.getItem("UserEarnedPoints");
  }

  getToolsDets(){
    //alert("in");    
    let inputDets:any={userID:this.userID,code:this.toolsID,langCode:this.langCode}
    this._service.getToolsDets(inputDets)
    .subscribe(
      (data) => {
        console.log("Tools Details Reuslt => ", data);        
        this.toolsDets = data.toolsDets;   
        this.userTools = data.userTools;   
        this.userToolsCost = this.toolsDets.tools_price;  
        if(!this.userTools==false){
          this.toolsPayStatus = 1; 
        } else {
          this.toolsPayStatus = 0;
        }
        this.toolsDets.imgSrc = this.imgURL+"tools/"+this.toolsDets.tools_cover_image    
        this.toolsDets.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.toolsDets.tools_video_url);                                                  
        console.log(this.toolsDets);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  gotoPaynowPopup(){    
    this.showPopup = 1;
    this.payMsg = "";
    this.payBtn = 0;    
    if(parseFloat(this.userToolsCost) <= parseFloat(this.userPoints)){      
      this.payMsg = "Do you want to buy "+this.toolsDets.tools_title+", Click Pay Now.";
      this.payBtn=1;          
    } else {      
      this.payMsg = "Current point is insufficient to buy, Click add money to buy more points.";
      this.payBtn=0;
    } 
  }

  buyUserTools(){   
    this.showPopup = 0;
      let input:any={userID:this.userID,toolsDets:this.toolsDets};
      console.log(input);      
      this._service.buyUserTools(input)
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

              this._notification.success("Tools Bought Successfully.");
              this.getToolsDets();                                                
            }
          },
          (err:any) => {
            console.log;
          }
        );    
  }

  closePaynowpopup(){
    this.showPopup = 0;
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
