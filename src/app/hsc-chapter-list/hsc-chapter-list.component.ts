import { Component, OnInit } from '@angular/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {trigger, transition, animate, style, state} from '@angular/animations';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-hsc-chapter-list',
  templateUrl: './hsc-chapter-list.component.html',
  styleUrls: ['./hsc-chapter-list.component.scss'],
  animations: [
    trigger('slideUpDown', [
      transition('void => *', [
        style({height: 0, margin: 0, padding: 0}),
        animate(200, style({height: '*', margin: '*', padding: '*'}))
      ]),
      transition('* => void', [
        style({height: '*', margin: '*', padding: '*'}),
        animate(200, style({height: 0, margin: 0, padding: 0}))
      ])
    ])
  ]
})
export class HscChapterListComponent implements OnInit {
  currCode:any = environment.CurrCode;
  languageSelected:any="";
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  mode: ProgressSpinnerMode = 'determinate';
  value = 0;
  hscList:any=[];
  selectedHSC:any="";

  showchplist:any;
  showPopup = 0;
  showWebPopup:any=0;

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
  userStatus:any=2;
  planCost:any=0;
  payBtn:any=0;
  payMsg:any="";

  showPopup2:number=0;
  pdfWidth:any = 0;
  listWidth:any;
  courseID:any="";
  detsType:any="Course";

  bookingForm!: FormGroup;
  submitted = false;
  btnDis:number = 0;
  userToolsCost:any="";

  seminarID:any="";  
  seminarDets:any=""; 
  seminarSlots:any="";
  dateTime:any=""; 
  alertPopup:any=0;
  alertPopupMsg:any=""; 
  langLength:any="";
  selectedLang:any="";
  selectedLangCode:any="";  

  constructor(
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    public sanitizer: DomSanitizer,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
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

    /*window.addEventListener("message", (result:any) => {
      //console.log(result.data);
      let input:any=JSON.parse(result.data);
      //console.log(input);   
      if(input.type==="completed"){
        //alert("Video End");
        if(this.selectedCourse.course_quiz_code!=0){
          this.showPopup2 = 1;
        }          
      }          
    }, false)*/
    this._service.getQuizType.subscribe((type:any) => {
      //alert(type);
      if(type=="HSC"){
        //alert("in");
        if(this.selectedCourse.course_quiz_code!=0){
          this.showPopup2 = 1;
        }          
      } 
    });

    this.bookingForm = this.formBuilder.group({                             
      userID: [this.userID],
      seminarID: [''],
      selectedDateTime: [''],
      selectedDate: [''],
      selectedTime: [''],
      selectedLangCode: [''],
      status: ['Active']           
    });
  }

  ngOnInit(): void {
    this.videoID = 1;
    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false){          
          this.courseID=params['code'];                    
        }        
    });
    this.getCourseList();   
    this.userPoints = localStorage.getItem("UserEarnedPoints");
  }

  get valid() { return this.bookingForm.controls; }

  /*getHSCList(){
    //alert("in");    
    let lang:any={langCode:this.languageSelected};
    this._service.getHSCList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.hscList = data.hscList;   
        
        if(this.hscList.length > 0){
          this.getHSCQuizDets();          
        } 

        for(let i=0;i<this.hscList.length;i++){
          //this.hscList[i].fileSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.hscList[i].vguides_url);                       
          this.hscList[i].imgSrc = this.imgURL+"hsc/"+this.hscList[i].hsc_cover_image

          this.hscList[i].completedChapters = 0;
          this.hscList[i].stars = 0;
          this.hscList[i].value = 0;
        }                         
        console.log(this.hscList);

        this.selectedHSC = this.hscList[0];
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }*/

  getCourseList(){
    //alert("in");        
    let lang:any={userID:this.userID,code:this.videoID,langCode:this.languageSelected};
    this._service.getCourseList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.courseList = data.courseList; 
        this.planDets = data.planDets[0];  
        this.userStatus = data.hscStatus; 
        this.planCost = this.planDets.price_rate;
        if(this.userStatus==""){
          this.userStatus = 0;
        }

        if(this.courseList.length > 0){
          this.getHSCQuizDets();          
        }

        for(let i=0;i<this.courseList.length;i++){
          this.courseList[i].course_name = (this.courseList[i].course_title).replace('-','<br>');
          this.courseList[i].fileSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.courseList[i].course_url);                       
          //this.courseList[i].imgSrc = this.imgURL+"hsc/"+this.courseList[i].course_image;
          this.courseList[i].imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.courseList[i].course_image);
          this.courseList[i].stars = 0;

          if(this.courseList[i].course_show_webinar==1 && !this.courseList[i].seminarDets==false){
            let seminarDets:any = this.courseList[i].seminarDets;
            if(seminarDets.seminar_image!=""){
              seminarDets.imgSrc = this.imgURL+"seminar/"+seminarDets.seminar_image;
            } else {
              seminarDets.imgSrc = "assets/images/no-image.jpg";
            }
          }
        }                                 
        this.selectedCourse = this.courseList[0];                        
        console.log(this.courseList);
        console.log(this.selectedCourse);
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
        this.courseCompleted = parseInt(this.courseList.length); 
        //alert(this.courseCompleted);   

        if(this.userStatus == 0){
          this.courseCompleted=-1;          
        }
                       
        let lastCode:number=0;
        for(let i=0;i<this.courseList.length;i++){
          this.courseList[i].show = 0;          
          for(let q=0;q<this.hscQuizDets.length;q++){
            if(this.courseList[i].course_hsc_code == this.hscQuizDets[q].crresult_hsc_code && this.courseList[i].course_code == this.hscQuizDets[q].crresult_course_code){
              this.courseList[i].stars = this.hscQuizDets[q].crresult_total_stars;                  
              //this.courseCompleted = parseInt(<any>this.courseCompleted) + 1;  
              //this.selectCourse(this.courseList[(i+1)]);   
              
              if(this.courseList[i].course_show_webinar==1 && this.courseList[i].semOpenStatus==1){  
                this.detsType="Course";
                this.selectCourse(this.courseList[(i+1)]);   
              } else {
                if(this.courseList[i].course_show_webinar==1 && this.courseList[i].course_webinar_mandatory==1){  
                  this.detsType="Webinar";
                  this.gotoSeminardetails(this.courseList[i].seminarDets);   
                } else {
                  this.detsType="Course";
                  this.selectCourse(this.courseList[(i+1)]);   
                }                
              }
            }         
          }
        }

        for(let i=0;i<this.courseList.length;i++){
          if(this.courseList[i].course_quiz_code != 0){
            if(this.courseList[i].stars>0){
              this.courseList[i].show = 1;
              lastCode = i;
            } else {              
              if(i>0){
                if(this.courseList[i-1].course_show_webinar==1 && this.courseList[i-1].semOpenStatus==1){  
                  this.courseList[i].show = 1;
                } else {
                  if(this.courseList[i-1].course_show_webinar==1 && this.courseList[i-1].course_webinar_mandatory==1){  
                    this.courseList[i].show = 0;
                  } else {
                    this.courseList[i].show = 1;
                  }                
                }
              } else {
                this.courseList[i].show = 1;
              }
              //this.courseList[i].show = 1;
              break;              
            }
          } else {
            this.courseList[i].show = 1;
          }       
          
          if(this.courseID!="" && this.courseID == this.courseList[i].course_code){
            //alert("Added");      
            this.detsType="Course";      
            this.selectCourse(this.courseList[i]); 
          }  
        }        
        console.log(this.courseCompleted);
        console.log(this.courseList);        
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  selectCourse(input:any){
    this.detsType="Course";
    this.selectedCourse = input;
    console.log(this.selectedCourse);
  }

  gotoQuiz(course:any){
    console.log(course);
    //let url:any='/quiz/Course/'+course.course_hsc_code+'/'+course.course_code+'/'+course.course_hsc_lang;
    let url:any='/quiz/Course/'+course.course_hsc_code+'/'+course.course_code+'/'+this.languageSelected;
    //alert(url);
    this.router.navigate([url]);
  }

  visibleIndex = 0;
  disableCourse(listID:any){
    if (this.visibleIndex === listID) {
      this.visibleIndex = 0;
    } else {
      this.visibleIndex = listID;
    }
    //alert(this.visibleIndex);
  }

  gotoPaynowPopup(){
    this.showPopup = 1; 
    this.payMsg = "";
    this.payBtn = 0;    
    //alert(this.planCost+" == "+this.userPoints);
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
    let input:any={userID:this.userID,planDets:this.planDets,lang:this.languageSelected};
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

  fullscreenBtn(){
    this.pdfWidth = !this.pdfWidth;
    this.listWidth = !this.listWidth;
  }

  closePaynowpopup2(){
    this.showPopup2 = 0;
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

   

  gotoSeminardetails(seminar:any){
    //alert(seminar.seminar_code);
    this.detsType="Webinar";
    if(!seminar==false){
      this.selectedCourse = seminar;
      console.log(this.selectedCourse);

      this.seminarID = this.selectedCourse.seminar_id;
      this.seminarSlots = this.selectedCourse.seminarSlots;
      this.userToolsCost = this.selectedCourse.seminar_amount;
      console.log(this.seminarSlots);
      this.langLength = this.selectedCourse.langList.length;
      this.bookingForm.patchValue({              
        seminarID: this.seminarID
      });

      if(this.langLength == 1){
          this.selectedLang=this.selectedCourse.langList[0].lang_name;
          this.selectedLangCode=this.selectedCourse.langList[0].lang_code;

          this.bookingForm.patchValue({
            selectedLangCode : this.selectedLangCode      
          });
      }  
    } else {
      this.selectedCourse = "";
    }
    //this.router.navigate(['/academy/seminar-details/'+seminar.seminar_code+'/'+seminar.seminar_lang]);
  }

  gotoWebPaynowPopup(){    
    this.submitted = true;
    // stop here if form is invalid
    if (this.bookingForm.invalid) {      
        return;
    }
    this.btnDis = 1;
    if(this.selectedCourse.seminar_amount == 0){
      this.makeBooking();
    } else {
      this.showWebPopup = 1;
      this.payMsg = "";
      this.payBtn = 0;    
      //alert(this.userToolsCost+" <= "+this.userPoints);      
      if(parseFloat(this.userToolsCost) <= parseFloat(this.userPoints)){      
        //this.payMsg = "Do you want to Enroll with "+this.selectedCourse.seminar_topic+", Click Pay Now.";
        this.payMsg = this.translate.instant('seminar_list.enroll_msg',{title:this.selectedCourse.seminar_topic});
        this.payBtn=1;          
      } else {      
        //this.payMsg = "Current point is insufficient to Enroll, Click add money to buy more points.";
        this.payMsg = this.translate.instant('seminar_list.nobal_msg');
        this.payBtn=0;
      }
    }     
  }

  makeBooking(){   
    this.showWebPopup = 0;
    this.bookingForm.patchValue({              
      //seminarID: this.seminarID
    });

    console.log(this.bookingForm.value);

    let bookingDets:any=this.bookingForm.value;

    let input:any={userID:this.userID,bookingDets:bookingDets,seminarDets:this.selectedCourse};
    console.log(input);

    this._service.saveSeminarBoking(input)
    .subscribe(
      (data) => {
        console.log("Booking Reuslt => ", data);  
        if(data.bookID!=""){
          this.userPoints = data.userPoints;
          localStorage.setItem("UserEarnedPoints",<any>parseFloat(this.userPoints));  
          this._service.setUserPoints(this.userPoints);

          this.chatCount=data.unreadTotalCount
          localStorage.setItem("TotalChatCount",<any>parseFloat(this.chatCount));
          this._service.setChatCount(this.chatCount);

          this.getCourseList();

          // this._notification.success("Booking Completed.");    
          //this._notification.success(this.translate.instant('seminar_list.booking_msg'));
          this.alertPopup=1;
          this.alertPopupMsg=this.translate.instant('seminar_list.booking_msg',{title:this.selectedCourse.seminar_topic});          
          this.resetForm();                  
        }
      },
      response => {
        this.btnDis = 0;
        console.log("POST call in error", response);    
        this._notification.warning("Something error in login, Try again.");                          
      });
  }

  resetForm(){
    this.bookingForm.patchValue({   
      userID: this.userID,
      seminarID: "",
      selectedDateTime:'',
      selectedDate: '',
      selectedTime: '',
      selectedLangCode: '',
      status: 'Active'  
    });
  }

  selectDT(){
    console.log(this.bookingForm.value['selectedDateTime']);
    let dt:any=this.bookingForm.value['selectedDateTime'];
    this.bookingForm.patchValue({              
      selectedDate: dt.sslot_date,
      selectedTime: dt.sslot_time     
    });
  }

  closeWebPaynowpopup(){
    this.showWebPopup = 0;
  }

 // closeAlertPopup(){
   // this.alertPopup = 0;
 // }
   

}
