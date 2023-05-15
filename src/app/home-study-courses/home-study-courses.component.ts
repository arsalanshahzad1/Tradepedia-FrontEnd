import { Component, OnInit } from '@angular/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-home-study-courses',
  templateUrl: './home-study-courses.component.html',
  styleUrls: ['./home-study-courses.component.scss']
})
export class HomeStudyCoursesComponent implements OnInit {
  languageSelected:any="";
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  currCode:any = environment.CurrCode;

  mode: ProgressSpinnerMode = 'determinate';
  value = 0;

  courseList:any=[];
  userID:any="";
  userPoints:any="";
  chatCount:any=0;
  selectedCourse:any="";
  videoID:any=""; 
  langCode:any=""; 

  hscQuizDets:any=[];
  courseCompleted:number=0;
  planDets:any="";
  userStatus:any=0;
  planCost:any=0;
  payBtn:any=0;
  payMsg:any="";

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
    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false){
          //this.getCouponDets(params['code']);
          this.videoID=params['code'];        
          this.langCode=params['lang'];        
          this.getCourseList();          
        }
    });   
    
    this.userPoints = localStorage.getItem("UserEarnedPoints");
  }

  getCourseList(){
    //alert("in");    
    let lang:any={userID:this.userID,code:this.videoID,langCode:this.langCode};
    this._service.getCourseList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.courseList = data.courseList; 
        this.planDets = data.planDets[0];  
        this.userStatus = data.hscStatus; 
        this.planCost = this.planDets.price_rate

        if(this.courseList.length > 0){
          this.getHSCQuizDets();          
        }

        for(let i=0;i<this.courseList.length;i++){
          this.courseList[i].fileSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.courseList[i].course_url);                       

          this.courseList[i].stars = 0;
        }                                 
        this.selectedCourse = this.courseList[0];                        
        console.log(this.courseList);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  getHSCQuizDets(){
    //alert("in");    
    let ebookDets:any={userID:this.userID, videoID:this.videoID};
    this._service.getHSCQuizDets(ebookDets)
    .subscribe(
      (data) => {
        console.log("Ebook Quiz Reuslt => ", data);        
        this.hscQuizDets = data.hscQuizDets;     
        this.courseCompleted = parseInt(this.hscQuizDets.length); 
        //alert(this.courseCompleted);   

        if(this.userStatus == 0){
          this.courseCompleted=-1;          
        }
                   
        for(let i=0;i<this.courseList.length;i++){
          for(let q=0;q<this.hscQuizDets.length;q++){
            if(this.courseList[i].course_hsc_code == this.hscQuizDets[q].crresult_hsc_code && this.courseList[i].course_code == this.hscQuizDets[q].crresult_course_code){
              this.courseList[i].stars = this.hscQuizDets[q].crresult_total_stars;  
            }            
          }
        }
        //alert(this.courseCompleted);
        console.log(this.courseList);        
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  selectCourse(input:any){
    this.selectedCourse = input;
  }

  gotoQuiz(course:any){
    console.log(course);
    let url:any='/quiz/Course/'+course.course_hsc_code+'/'+course.course_code+'/'+course.course_hsc_lang;
    //alert(url);
    this.router.navigate([url]);
  }

  visibleIndex = 0;
  disableChapter(listID:any){
    if (this.visibleIndex === listID) {
      this.visibleIndex = 0;
    } else {
      this.visibleIndex = listID;
    }
  }

  showPopup = 0;
  gotoPaynowPopup(){
    this.showPopup = 1;
    //this.userPoints = 200;
    this.payMsg = "";
    this.payBtn = 0;    
    if(parseFloat(this.planCost) <= parseFloat(this.userPoints)){      
      //this.payMsg = "Do you want to make for HSC, Click Pay Now.";
      this.payMsg = this.translate.instant('hsc_chapterlist.buy_question');
      this.payBtn=1;          
    } else {      
      //this.payMsg = "Current point is insufficient to buy, Click add money to buy more points.";
      this.payMsg = this.translate.instant('hsc_chapterlist.no_points');
      this.payBtn=0;
    }    
  }
  closePaynowpopup(){
    this.showPopup = 0;
  }

  saveHSCPayment(){
    this.showPopup = 0;
    let input:any={userID:this.userID,planDets:this.planDets};
    console.log(input);      
    this._service.saveHSCPayment(input)
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
            
            this._notification.success("HSC Bought Successfully.");
            this.getCourseList();                                         
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
