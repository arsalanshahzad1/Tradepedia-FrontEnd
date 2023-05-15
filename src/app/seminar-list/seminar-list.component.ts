import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-seminar-list',
  templateUrl: './seminar-list.component.html',
  styleUrls: ['./seminar-list.component.scss'],
  providers: [DatePipe]
})
export class SeminarListComponent implements OnInit {
  currCode:any = environment.CurrCode;
  languageSelected:any="";
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  seminarList:any=[];

  seminarID:any="";  
  seminarDets:any=""; 
  seminarSlots:any=""; 

  selectedDate:any="";
  selectedTime:any="";
  selectedLang:any="";
  selectedLangCode:any="";  

  bookingForm!: FormGroup;
  submitted = false;
  btnDis:number = 0;

  langLength:any="";
  userID:any="";
  dateTime:any="";

  showPopup = 0;
  payBtn:any=0;
  payMsg:any="";
  userPoints:any="";
  chatCount:any=0;
  userToolsCost:any="";
  timeZone:any="";
  
  constructor(
    private formBuilder: FormBuilder,
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private translate: TranslateService,
    public datepipe: DatePipe,
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    if(!localStorage.getItem("UserID")==false){
      this.userID = localStorage.getItem("UserID");        
    }
    this.getUserPoints();

    if(!localStorage.getItem('selectedLang')==false){
      this.languageSelected = localStorage.getItem('selectedLang');        
    } else {
      this.languageSelected = "EN";      
    } 

    if(!localStorage.getItem("UserTimezone")==false){
      this.timeZone = localStorage.getItem("UserTimezone");        
    } else {
      this.timeZone="+0000";
    }  

    this.bookingForm = this.formBuilder.group({                             
      userID: [this.userID],
      seminarID: [this.seminarID],
      selectedDateTime: [''],
      selectedDate: [''],
      selectedTime: [''],
      selectedLangCode: [''],
      status: ['Active']           
    });
  }

  ngOnInit(): void {
    this.userPoints = localStorage.getItem("UserEarnedPoints");
    this.getSeminarList();
  }

  get valid() { return this.bookingForm.controls; }

  goback(){
    if(this.seminarDets.seminar_location=="Webinar"){
      this.router.navigate(['/academy/home-study-courses/1/'+this.languageSelected]);
    } else {
      this.router.navigate(['/academy/seminar-list']);
    }
  }

  getSeminarList(){
    //alert("in");    
    let lang:any={langCode:this.languageSelected,userID:this.userID};
    this._service.getSeminarList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.seminarList = data.seminarList;                    
        for(let i=0;i<this.seminarList.length;i++){
          if(this.seminarList[i].seminar_image!=""){
            this.seminarList[i].imgSrc = this.imgURL+"seminar/"+this.seminarList[i].seminar_image;
          } else {
            this.seminarList[i].imgSrc = "assets/images/no-image.jpg";
          }
        }
        console.log(this.seminarList);
        this.gotoSeminardetails(this.seminarList[0]);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  gotoSeminardetails(seminar:any){    
    this.seminarDets = seminar;
    console.log(this.seminarDets);

    this.seminarID = this.seminarDets.seminar_id;
    this.seminarSlots = this.seminarDets.seminarSlots;
    this.userToolsCost = this.seminarDets.seminar_amount;
    console.log(this.seminarSlots);
    this.langLength = this.seminarDets.langList.length;

    for(let i=0;i<this.seminarSlots.length;i++){
      let dat:any = this.datepipe.transform(this.seminarSlots[i].sslot_date+" "+this.seminarSlots[i].sslot_time, 'yyyy-MM-dd HH:mm:ss');
      //alert(dat);
      this.seminarSlots[i].sslot_date2 = (dat.replace(" ","T"))+"Z";          
    }

    if(this.langLength == 1){
        this.selectedLang=this.seminarDets.langList[0].lang_name;
        this.selectedLangCode=this.seminarDets.langList[0].lang_code;

        this.bookingForm.patchValue({
          selectedLangCode : this.selectedLangCode      
        });
    }  
  }

  gotoPaynowPopup(){    
    this.submitted = true;
    // stop here if form is invalid
    if (this.bookingForm.invalid) {      
        return;
    }
    this.btnDis = 1;
    if(this.seminarDets.seminar_amount == 0){
      this.makeBooking();
    } else {
      this.showPopup = 1;
      this.payMsg = "";
      this.payBtn = 0;    
      if(parseFloat(this.userToolsCost) <= parseFloat(this.userPoints)){      
        //this.payMsg = "Do you want to Enroll with "+this.seminarDets.seminar_topic+", Click Pay Now.";
        this.payMsg = this.translate.instant('seminar_list.enroll_msg',{title:this.seminarDets.seminar_topic});
        this.payBtn=1;          
      } else {      
        //this.payMsg = "Current point is insufficient to Enroll, Click add money to buy more points.";
        this.payMsg = this.translate.instant('seminar_list.nobal_msg');
        this.payBtn=0;
      }
    }     
  }

  makeBooking(){   
    this.showPopup = 0;
    this.bookingForm.patchValue({              
      seminarID: this.seminarID
    });

    console.log(this.bookingForm.value);

    let bookingDets:any=this.bookingForm.value;

    let input:any={userID:this.userID,bookingDets:bookingDets,seminarDets:this.seminarDets,lang:this.languageSelected};
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

          // this._notification.success("Booking Completed.");    
          this._notification.success(this.translate.instant('seminar_list.booking_msg',{title:this.seminarDets.seminar_topic}));
          this.resetForm();                  
        }
      },
      response => {
        this.btnDis = 0;
        console.log("POST call in error", response);    
        //this._notification.warning("Something error in login, Try again.");  
        this._notification.warning(this.translate.instant('seminar_list.some_msg'));                        
      });
  }

  resetForm(){
    this.bookingForm.patchValue({   
      userID: this.userID,
      seminarID: this.seminarID,
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
