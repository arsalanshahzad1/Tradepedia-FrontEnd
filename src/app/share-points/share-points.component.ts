import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PagesService } from '../services/pages.service';
import { Router } from '@angular/router';
import { TranslationComponent } from '../translation/translation.component';
import { CookieService } from 'ngx-cookie-service';
import { NotificationService } from '../services/notification.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-share-points',
  templateUrl: './share-points.component.html',
  styleUrls: ['./share-points.component.scss']
})
export class SharePointsComponent implements OnInit {  
  currCode:any = environment.CurrCode;
  userID:any="";
  userPoints:any="";  
  sharePoints:any="";
  chatCount:any=0;
  shareForm!: FormGroup;
  submitted = false;
  btnDis:number = 0;

  receiverID:any="";
  receiverUsername:any="";
  receiverName:any="";

  btnStatus:any=0;
  errorMsg:any=0;

  alertPopup:any=0;
  alertPopupMsg:any="";  

  alertPopup2:any=0;
  alertPopupMsg2:any="";
  
  constructor(
    private formBuilder: FormBuilder,
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
    this.getUserPoints();
  }

  ngOnInit(): void {
    this.userPoints = localStorage.getItem("UserEarnedPoints");

    this.shareForm = this.formBuilder.group({                       
      sharePoints: ['', [Validators.required]],      
      receiverUsername: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],      
    });
  }

  get valid() { return this.shareForm.controls; }

  showPopup = 0;
  gotoPaynowpopup(){
    this.showPopup = 1;
  }
  closePaynowpopup(){
    this.btnStatus = 0;
    this.showPopup = 0;
  }

  getUserDets2(){
    if(this.shareForm.value['receiverUsername']!=""){
      let input:any={username:this.shareForm.value['receiverUsername']};
      this.errorMsg = 0;
      this._service.getReceiverDets(input)
        .subscribe(
          (result:any) => {
            console.log(result);      
            if(!result.userDets==false){
              this.receiverID = result.userDets.user_id;
              this.receiverName = result.userDets.user_firstname+" "+result.userDets.user_lastname;                         
            
              this.btnStatus = 1;
            } else {
              this.alertPopup2=1;
              this.alertPopupMsg2="Invalid user, Try another one.";
            }        
          },
          (err) => {
            this.btnStatus = 0;
            console.log;
          }
        );   
    } else {
      this.errorMsg = 1;      
    }
  }

  getUserDets(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.shareForm.invalid) {
        return;
    }
    this.btnStatus = 1;      

      let input:any={username:this.shareForm.value['receiverUsername']};
      this.errorMsg = 0;
      this._service.getReceiverDets(input)
        .subscribe(
          (result:any) => {
            console.log(result);      
            if(!result.userDets==false){
              this.receiverID = result.userDets.user_id;
              this.receiverName = result.userDets.user_firstname+" "+result.userDets.user_lastname;                         
            
              this.showPopup = 1;              
            } else {
              this.alertPopup2=1;
              this.alertPopupMsg2="Invalid user, Try another one.";
              this.btnStatus = 0;
            }        
          },
          (err) => {
            this.btnStatus = 0;
            console.log;
          }
        ); 
  }

  saveTransaction(){
    /*this.submitted = true;

    // stop here if form is invalid
    if (this.shareForm.invalid) {
        return;
    }
    this.btnDis = 1;*/

    //alert(this.receiverUsername);
    this.showPopup = 0;
    this.btnStatus = 1;
    let input:any={userID:this.userID,receiverID:this.receiverID,sharePoints:this.shareForm.value['sharePoints']};
    console.log(input);      
    this._service.saveTransaction(input)
      .subscribe(
        (result:any) => {
          console.log(result);   
          this.btnStatus = 0;
          if(result.transID!=""){
            this.userPoints = result.userPoints;
            localStorage.setItem("UserEarnedPoints",<any>parseFloat(this.userPoints));  
            this._service.setUserPoints(this.userPoints); 

            this.chatCount=result.unreadTotalCount
            localStorage.setItem("TotalChatCount",<any>parseFloat(this.chatCount));
            this._service.setChatCount(this.chatCount);
            
            this.alertPopup=1;
            this.alertPopupMsg="Points Shared Successfully.";
            //this._notification.success("Points Shared Successfully.");

            setTimeout(() => {
              this.closeAlertPopup();
            }, 1500);      	                          
          }
          else{
            this.alertPopup=1;
            this.alertPopupMsg=result.error;
             setTimeout(() => {
              this.closeAlertPopup();
            }, 1500);
          }                  
        },
        (err) => {
          this.btnStatus = 0;
          console.log;
        }
      );
  }

  closeAlertPopup(){
    this.alertPopup = 0;
    this.router.navigate(['/wallet']); 
  }

  closeAlertPopup2(){
    this.alertPopup2 = 0;    
    this.errorMsg = 0;
    this.receiverUsername = "";
  }

  convertToLower() {
    let email = this.shareForm.value['receiverUsername'];
    email= (email.toLowerCase()).trim();    
    this.shareForm.patchValue({
      receiverUsername : email      
    });
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
