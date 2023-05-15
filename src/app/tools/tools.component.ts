import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';



@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {
  languageSelected:any="";
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  showLoad:any=0;
  toolsList:any=[];

  //Tool Details
  currCode:any = environment.CurrCode;
  langCode:any="";
  toolsID:any="";
  toolsType:any="";  
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

  alertPopup:any=0;
  alertPopupMsg:any="";
  alertPopupImg:any="";
  selectedIndex: any;

  selectedPlan: any=[];
  xmacno:any="";
  xmacurl:any="";

  constructor(
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    public sanitizer: DomSanitizer,
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
    
    if(!localStorage.getItem("UserID")==false){
      this.userID =localStorage.getItem("UserID");        
    }
    this.getUserPoints();
    this.getExternalLink();
  }

  ngOnInit(): void {    
    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['type']==false){          
          this.toolsType=params['type'];     
          this.getToolsList();     
        }
    });   
    this.userPoints = localStorage.getItem("UserEarnedPoints");
  }

  filterFunction(arrlist: any[],type:any): any {  
    if (!arrlist || !type) {
        return arrlist;
    }    
    return arrlist.filter((item:any) => item.tools_type.indexOf(type) !== -1);
  }

  getToolsList(){
    //alert("in");    
    this.showLoad = 0;
    let input:any={type:this.toolsType,langCode:this.languageSelected,userID:this.userID};
    this._service.getToolsList(input)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data); 
        this.showLoad = 1;       
        this.toolsList = data.toolsList;                    
        for(let i=0;i<this.toolsList.length;i++){
          this.toolsList[i].imgSrc = this.imgURL+"tools/"+this.toolsList[i].tools_cover_image
          this.toolsList[i].videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.toolsList[i].tools_video_url);                                                  

          let userTools:any =  this.toolsList[i].userTools;   
          this.userToolsCost =  this.toolsList[i].tools_price;  
          if(userTools.showStatus==1){
            this.toolsList[i].toolsPayStatus = 1; 
          } else {
            this.toolsList[i].toolsPayStatus = 0;
          }          
        }
        console.log(this.toolsList);

        //this.toolsID = "";
        this.toolsDets = "";
        //this.selectedIndex = "";
        if(!this.toolsList==false){
          this.toolsID = this.toolsList[0].tools_code;
          this.toolsDets = this.toolsList[0];
          this.selectedIndex = this.toolsDets;
        }
                
        /*if(this.toolsID==""){
          this.toolsID = this.toolsList[0].tools_code
          this.toolsDets = this.toolsList[0];
          this.selectedIndex = this.toolsDets;
        } else {
          for(let i=0;i<this.toolsList.length;i++){
            if(this.toolsList[i].tools_code == this.toolsID){
              this.toolsDets = this.toolsList[i];
              this.selectedIndex = this.toolsDets;
            }
          }
        }*/        
        console.log(this.toolsDets);
      },
      response => {
        this.showLoad = 0;
        console.log("POST call in error", response);                              
      });
  }

  gotoDetails(input:any){
    console.log(input);
    this.toolsID = input.tools_code;              
    this.toolsDets = input;
    console.log(this.toolsDets);
    //input.active = !input.active;
    this.selectedIndex = input;
  }


  //Tool Details
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

  gotoPaynowPopup(price:any){    
    this.showPopup = 1;
    this.payMsg = "";
    this.payBtn = 0;        
    this.selectedPlan = price
    this.userToolsCost = price.tprice_price;    
    
    if(parseFloat(this.userToolsCost) <= parseFloat(this.userPoints)){      
      //this.payMsg = "Do you want to buy "+this.toolsDets.tools_title+", Click Pay Now.";
      this.payMsg = this.translate.instant('tools.buy_msg',{toolName:this.toolsDets.tools_title});
      this.payBtn=1;          
    } else {      
      //this.payMsg = "Current point is insufficient to buy, Click add money to buy more points.";
      this.payMsg = this.translate.instant('tools.no_msg');
      this.payBtn=0;
    } 
  }

  buyUserTools(){   
    this.showPopup = 0;
    //alert(this.xmacno);
        
    let input:any={userID:this.userID,toolsDets:this.toolsDets,selectedPlan:this.selectedPlan,xmacno:this.xmacno,lang:this.languageSelected};
    console.log(input);      

      this._service.buyUserTools(input)
        .subscribe(
          (result:any) => {
            console.log(result);
            if(result.paymentID!=""){
              this.userPoints = result.userPoints;
              localStorage.setItem("UserEarnedPoints",<any>parseFloat(this.userPoints));  
              this._service.setUserPoints(this.userPoints); 
              //this._notification.success("Tools Bought Successfully.");

              this.chatCount=result.unreadTotalCount
              localStorage.setItem("TotalChatCount",<any>parseFloat(this.chatCount));
              this._service.setChatCount(this.chatCount);
              
              this.alertPopup=1;
              //this.alertPopupMsg="Tools Bought Successfully."; 
              this.alertPopupMsg=this.translate.instant('tools.success_msg');
              this.alertPopupImg="assets/images/validation-error.png";              
              this.getToolsList();   
              this.getUserPoints();                                             
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

  closeAlertPopup(){
    this.alertPopup = 0;   
  }

  getUserPoints(){    
    let input:any={userID:this.userID,userType:localStorage.getItem("UserType")};
    this._service.getUserPoints(input)
      .subscribe(
        (result:any) => {
          console.log("Current User Points"); 
          console.log(result);      
          this.userPoints = result.userPoints;
          this.xmacno = result.userXmacno;
          localStorage.setItem("UserEarnedPoints",<any>parseFloat(this.userPoints));  
          this._service.setUserPoints(this.userPoints);   
        },
        (err) => {
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
          console.log;
        }
      );
  }

}
