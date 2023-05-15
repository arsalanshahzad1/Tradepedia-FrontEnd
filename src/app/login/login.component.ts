import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SignalsService } from '../services/signals.service';
import { PagesService } from '../services/pages.service';
import { environment } from '../../environments/environment';
import { NotificationService } from '../services/notification.service';
import {TranslateService} from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import { PasswordStrengthValidator } from "../validation/password-strength.validators";
import * as CryptoJS from 'crypto-js';
import { ThemeService } from '../services/theme.service';

import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { TranslationComponent } from '../translation/translation.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide:boolean = true;
  passwordKey:any = environment.userPasswordKey;
  registerForm!: FormGroup;
  submitted = false;
  btnDis:number = 0;

  socialUser!: SocialUser;
  isLoggedin: boolean=false; 

  registerData:any=[]; 
  loginData:any=[]; 

  alertPopup:any=0;
  alertPopupMsg:any="";
  alertPopupImg:any="";

  loginthemeLogo:number = 1;

  authLoader:any = 0;
  showBtn:any = 0;

  constructor(
    public dialog: MatDialog,
    private _service : SignalsService, 
    private router : Router,
    private themeService: ThemeService,
    private formBuilder: FormBuilder,
    public _notification: NotificationService,
    private translate: TranslateService,
    private cookieService: CookieService,  
    private _pageservice: PagesService,
    private socialAuthService: SocialAuthService,  
  ) {
    //console.log(localStorage);
    if(localStorage.getItem("Jwt-token")!=null){      
       this.router.navigate(['/home']);
    }
    this.logout();     
    //this.socialLogOut();  
    
    let lang="";
    if(!this.cookieService.get('selectedLang')==true){
      this.cookieService.set('selectedLang','EN'); 
      this.translate.use('en');
    } else {
      lang=this.cookieService.get('selectedLang');
      this.translate.use(lang.toLowerCase());
    }

    if(this.themeService.theme === 'dark'){
      this.loginthemeLogo = 0;
    }
    else{
      this.loginthemeLogo = 1;
    }
   }

  ngOnInit(): void {
   if(localStorage.getItem("Jwt-token")!=null){      
       this.router.navigate(['/home']);
    }
    //localStorage.clear();   
    this.registerForm = this.formBuilder.group({                       
      username: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      //username: ['', [Validators.required]],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });

    this.socialAuthService.authState.subscribe((user) => {
      console.log("socialAuthService starts");
      this.socialUser = user;
      this.isLoggedin = (user != null);
      console.log(this.socialUser);  

      if(!this.socialUser==false){
        let randPwd:any=this._service.randomString();
        console.log(randPwd);

        let tempUser=this.socialUser.email;
        this.registerData = {                    
            provider: this.socialUser.provider,
            referID: this.socialUser.id,
            mailid: tempUser,
            username: tempUser,
            password: randPwd,
            firstname: this.socialUser.firstName,
            lastname: this.socialUser.lastName,
            age: '',
            gender: ''       
        };

        /*let tempUser="google10@mail.com";
        this.registerData = {                    
            provider: this.socialUser.provider,
            referID: this.socialUser.id,
            mailid: tempUser,
            username: tempUser,
            password: randPwd,
            firstname: 'Google',
            lastname: 'User 10',
            age: '',
            gender: ''       
        };*/

        console.log(this.registerData); 
        this.getSocialUserDets(tempUser);             
      }
    });
  }

  loginWithGoogle(): void {
    console.log("loginWithGoogle starts");
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
  
  socialLogOut(): void {
    //this.socialAuthService.signOut();
    this.socialAuthService.signOut().then((data:any) => {
      console.log(data);
      this.router.navigate(['/login']);
    }).catch((error:any) => {
      console.log(error);
    });
  }

  getSocialUserDets(username:any){    
    let input:any={username:username};
    this._pageservice.getSocialUserDets(input)
      .subscribe(
        (result:any) => {
          console.log(result);    
         
          if(!result.socialDets==false){
            /*this.registerForm.patchValue({                    
                username: result.socialDets.user_username,
                password: result.socialDets.password          
            });*/

            this.loginData = {
              username: result.socialDets.user_username,
              password: result.socialDets.password 
            }
            this.socialLogin();
          } else {
            //this._notification.warning("User not exist"); 
            console.log(this.registerData); 
            //this.socialRegister();

            this.btnDis = 0;
            this.authLoader = 0;            
            this.alertPopup=1;
            //this.alertPopupMsg="Invalid User, Try to register."; 
            this.alertPopupMsg=this.translate.instant('login.user_invalid');
            this.alertPopupImg="assets/images/validation-error.png";
          }          
        },
        (err:any) => {
          this.btnDis = 0;
          console.log;
        }
      );    
  }

  convertToLower() {
    let email = this.registerForm.value['username'];
    email= (email.toLowerCase()).trim();    
    this.registerForm.patchValue({
      username : email      
    });
  }

  get valid() { return this.registerForm.controls; }
  
  checkUserLoggedin():void{
  let token = localStorage.getItem("Jwt-token");
  // if(token==true){
  // this.router.navigate(['/home']);
  // }
  }
  
  logout(): void{       
    let token = localStorage.getItem("Jwt-token");
    let username = localStorage.getItem("username");
    let lang:any = this.cookieService.get('selectedLang');

    this.socialAuthService.signOut();    
    console.log(token);
    if(!token==true){
    console.log(token);
      this._service.logout(token,username)
      .subscribe(
          (data:any) => {                        
            console.log(data);                        
            localStorage.clear();            
            //this.router.navigate(['/login']);
            this.cookieService.set('selectedLang',lang);
          },
          (err:any) => {
            console.log(err);
            localStorage.clear();   
            //this._notification.warning("Oop's error an process");
            //this.router.navigate(['/login']);
          }
      );
    }    
  }

  gotoForgotPass(){
    this.router.navigate(['/forgot-password']);
  }

  gotoSignup(){
    this.router.navigate(['/register']);
  }

  userLogin(){    
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.btnDis = 1;
    this.authLoader = 1;

    let inputDets:any={username:this.registerForm.value['username'],password:this.registerForm.value['password']};
    this._service.userLogin(inputDets)
    .subscribe(
      (data) => {
        console.log("Login Reuslt => ", data);   
          
          let result:any = data.body;
          let requ:any = data.headers.get('jwt-token');
          console.log(result); 
          console.log(requ);

          if(result.active==true){
            let isLogged:any=true;
            let next:any=false;
            let index:any=0;
                      
            localStorage.setItem("UserID","");
            localStorage.setItem("UserName","");
            localStorage.setItem("EmailID","");
            localStorage.setItem("UserImage","");
            localStorage.setItem("username",inputDets['username']);
            //localStorage.setItem("password",inputDets['password']);
            localStorage.setItem("isLogged",isLogged);
            localStorage.setItem("Jwt-token",requ);		
            localStorage.setItem('signalNext',next);
            localStorage.setItem('signalIndex',index);
            localStorage.setItem('profileMode',"");
            localStorage.setItem('profileEditIndex',"");

            let password = CryptoJS.AES.encrypt(inputDets['password'], this.passwordKey).toString();
            console.log(password);

            this.cookieService.set('username',inputDets['username']);
            this.cookieService.set('password',password);
            localStorage.setItem("password",password);

            this.getUserDets(result);
          } else {
            this.updateInactiveUser(result);
            //this._notification.warning("User account is inactive.");            
            this.alertPopup=1;
            this.alertPopupMsg=this.translate.instant('login.user_inactive');
            this.alertPopupImg="assets/images/fail.png";            
          }
      },
      response => {
        this.btnDis = 0;
        this.authLoader = 0;
        console.log("POST call in error", response);   
        this.alertPopup=1;        
        this.alertPopupImg="assets/images/fail.png";  
        if(response.error.httpStatus!=""){
          //this._notification.warning(response.error.message);                          
          //this.alertPopupMsg=response.error.message; 
          this.alertPopupMsg=this.translate.instant('login.invalid_msg'); 
        } else {
          //this._notification.warning("Something error in login, Try again.");     
          //this.alertPopupMsg="Something error in login, Try again.";    
          this.alertPopupMsg=this.translate.instant('login.some_msg');                   
        }       
      });
  }

  socialLogin(){    
    this.btnDis = 1;
    this.authLoader = 1;
    let inputDets:any={username:this.loginData.username,password:this.loginData.password};
    this._service.userLogin(inputDets)
    .subscribe(
      (data) => {
        console.log("Login Reuslt => ", data);   
          
          let result:any = data.body;
          let requ:any = data.headers.get('jwt-token');
          console.log(result); 
          console.log(requ);

          if(result.active==true){
            let isLogged:any=true;
            let next:any=false;
            let index:any=0;
                      
            localStorage.setItem("UserID","");
            localStorage.setItem("UserName","");
            localStorage.setItem("EmailID","");
            localStorage.setItem("UserImage","");
            localStorage.setItem("username",inputDets['username']);
            //localStorage.setItem("password",inputDets['password']);
            localStorage.setItem("isLogged",isLogged);
            localStorage.setItem("Jwt-token",requ);		
            localStorage.setItem('signalNext',next);
            localStorage.setItem('signalIndex',index);
            localStorage.setItem('profileMode',"");
            localStorage.setItem('profileEditIndex',"");

            this.cookieService.set('username',inputDets['username']);
            this.cookieService.set('password',inputDets['password']);

            this.getUserDets(result);
          } else {
            this.updateInactiveUser(result);
            //this._notification.warning("User account is inactive.");            
            this.alertPopup=1;
            //this.alertPopupMsg="User account is inactive."; 
            this.alertPopupMsg=this.translate.instant('login.user_inactive');
            this.alertPopupImg="assets/images/fail.png";
           
          }
      },
      response => {
        this.btnDis = 0;
        this.authLoader = 0;
        console.log("POST call in error", response);   
        this.alertPopup=1;        
        this.alertPopupImg="assets/images/fail.png";

        if(response.error.httpStatus!=""){
          //this._notification.warning(response.error.message);                          
          this.alertPopupMsg=response.error.message; 
        } else {
          //this._notification.warning("Something error in login, Try again.");     
          this.alertPopupMsg=this.translate.instant('login.some_msg');                     
        }        
      });
  }

  /*socialRegister() {    
    //this._notification.longMsg("Registration going on, Please wait.");

    this.authLoader = 1;
    this.alertPopup=1;
    this.alertPopupMsg="Registration going on, Please wait."; 
    this.alertPopupImg="assets/images/validation-error.png";

    console.log(this.registerData); 
    let user:any={"email": this.registerData.mailid,"username": this.registerData.username,"password": this.registerData.password,"firstname": this.registerData.firstname,"lastname": this.registerData.lastname};
    //let user:any=this.registerForm.value;
    console.log(user);
    this._service.register(user)
      .subscribe(
        (data:any) => {
          console.log("POST call successful value returned in body", data);
          if(data.active == true){
             //this._notification.success("Registration Completed Successfully.");
            this.alertPopupMsg="Registration Completed Successfully."; 
            this.registerData.email = this.registerData.mailid;             
            this.saveUser(this.registerData);
          }
        },
        (response:any) => {
          console.log("POST call in error", response);   
          this.btnDis = 0;   
          this.authLoader = 0;    
          let msg = response['error']['message'];
          this.alertPopup=1;          
          this.alertPopupImg="assets/images/fail.png";

          if(msg!=""){
            if(msg=="Username already exists"){
              this.authLoader = 1;   
              this.checkUserStatus(this.registerData['username']);
            } else {
              this.alertPopupMsg = msg+", Try again.";        
            }

            //this._notification.warning(msg);
            //this.alertPopupMsg=msg; 
          } else {
            msg = "Error on registration, Try again."
            //this._notification.warning(msg);
            this.alertPopupMsg=msg; 
          }                
        });     

  }*/

  getUserDets(inputData:any){
    console.log(inputData);
    let input:any={username:inputData.username};
    this._pageservice.getUserDets(input)
      .subscribe(
        (result:any) => {
          console.log(result);
          if(!result.userDets==false){  
              if(result.userDets!==null){                
                if(result.userDets.user_verification==1){
                  localStorage.setItem("UserID",result.userDets.user_id);   
                  localStorage.setItem("UserName",(result.userDets.user_firstname+" "+result.userDets.user_lastname));
                  localStorage.setItem("EmailID",result.userDets.user_email);  
                  localStorage.setItem("UserImage",result.userDets.user_image); 
                  localStorage.setItem("UserType",result.userDets.user_type);             	                          
                  localStorage.setItem("UserEarnedPoints",<any>parseFloat(result.userDets.user_earned_points));     	                                          

                  localStorage.setItem("loginStatus",result.loginStatus);
                  localStorage.setItem("UserSignalLastID",result.userDets.user_last_signal_id);     
                  localStorage.setItem("UserOfferLastID",result.userDets.user_last_offer_id);     
                  localStorage.setItem("UserNewsLastID",result.userDets.user_last_news_id);  
                  localStorage.setItem("UserSquawkStatus",result.userDets.user_issquawk_member); 
                  localStorage.setItem("UserXmAccNo",result.userDets.user_xmacno); 
                  localStorage.setItem("UserCountry",result.userDets.user_country); 
                  if(result.userDets.user_timezone!=""){
                    localStorage.setItem("UserTimezone",result.userDets.user_timezone);
                  } else {
                    this.getTimezone(result.userDets.user_country);
                  }   

                  //alert(result.userDets.user_curr_lang);
                  this.cookieService.set('selectedLang',result.userDets.user_curr_lang)               
                  this._pageservice.setLang(result.userDets.user_curr_lang);
                  //alert(result.userDets.user_curr_lang.toLowerCase());
                  this.translate.use(result.userDets.user_curr_lang.toLowerCase());                                        
                  if (this.cookieService.get("selectedLang") === 'AR') {
                    //alert("In");
                    this._pageservice.setTransAlign(1);
                  } else {
                    //alert("Out");
                    this._pageservice.setTransAlign(0);
                  }    

                  this.updateUserAccess(result.userDets.user_id);

                  this.btnDis = 0;    
                  
                  let signalCount:any=result.newSignalCount;
                  let newsCount:any=result.newNewsCount;
                  let offerCount:any=result.newOfferCount;    
                  let newTotalCount:any=result.newTotalCount;    
                  let unreadTotalCount:any=result.unreadTotalCount;   
                  //alert(unreadTotalCount); 

                  localStorage.setItem("SignalNoteCount",signalCount);
                  localStorage.setItem("NewsNoteCount",newsCount);
                  localStorage.setItem("OfferNoteCount",offerCount);        
                  localStorage.setItem("DisplayNoteCount",newTotalCount);
                  localStorage.setItem("RetNoteCount",newTotalCount);
                  localStorage.setItem("TotalChatCount",unreadTotalCount);  
                  
                  this._pageservice.setNoteCount(newTotalCount);
                  this._pageservice.setSignalCount(signalCount);
                  this._pageservice.setOfferCount(offerCount);
                  this._pageservice.setNewsCount(newsCount);
                  this._pageservice.setChatCount(unreadTotalCount);
                            
                  window.location.reload();

                  // this.router.navigate(['/home'])
                  // this.router.navigate(['/login'])
                  // .then(() => {
                  //   window.location.reload();
                  // });
                } else {                
                  this.btnDis = 0;     
                  this.showBtn = 1; 
                  this.authLoader = 0;
                  this.alertPopup=1;
                  //this.alertPopupMsg="User Email ID not verified, Please check your mail.";
                  this.alertPopupMsg=this.translate.instant('login.not_verify_msg'); 
                  this.alertPopupImg="assets/images/fail.png";                   
                  //this.resetFormGroup();                     
                  //this.router.navigate(['/login']);
                }
              } else {
                inputData.provider = "Direct";
                inputData.referID = "";             
                this.saveUser(inputData);
              }     
          } else if(!result.userError==false){
            this.btnDis = 0;      
            this.authLoader = 0;
            this.alertPopup=1;
            //this.alertPopupMsg="Your account is inactive, Unable to login.";
            this.alertPopupMsg=this.translate.instant('login.inactive_nologin');
            this.alertPopupImg="assets/images/fail.png"; 
          }
        },
        (err) => {
          this.btnDis = 0;
          this.authLoader = 0;
          console.log;
        }
      );    
  }

  getTimezone(country:any){              
    let input:any={country:country};    
    this._pageservice.getTimezone(input)
    .subscribe(
      (data) => {
        console.log("Country Reuslt => ", data);
        console.log(data);    
        localStorage.setItem("UserTimezone",data.zoneDets.ctz_value);              
      },
      response => {        
        console.log("POST call in error", response);                              
      });
  }

  updateUserAccess(userID:any){
    this._pageservice.updateUserAccess({userID:userID})
    .subscribe( (data:any) => {
      console.log(data);
    });
  }

  updateInactiveUser(inputData:any){
    console.log(inputData);
    let input:any={username:inputData.username};
    this._pageservice.updateInactiveUser(input)
      .subscribe(
        (result:any) => {
          console.log(result);                        
        },
        (err:any) => {
          this.btnDis = 0;
          this.authLoader = 0;
          console.log;
        }
      );    
  }

  saveUser(inputData:any){
    //alert("In");
    console.log(inputData); 	
    let userDet:any={"provider": inputData['provider'],"referID": inputData['referID'],"mailid": inputData['email'],"username": inputData['username'],"password": inputData['password'],"firstname": inputData['firstname'],"lastname": inputData['lastname'],"age": "","gender": ""};
    console.log(userDet);
    
    //this._notification.longMsg("User Saving going on, Please wait.");      
    this.alertPopup=1;
    //this.alertPopupMsg="User Saving going on, Please wait."; 
    this.alertPopupMsg=this.translate.instant('login.save_going');
    this.alertPopupImg="assets/images/validation-error.png";

    this._service.saveUser(userDet)
      .subscribe(
        (data:any) => {
          console.log(data);                    
          let result = data;
          if(result.userID!=""){                       
            if(result.userDets.user_verification==1){        
              let points:any=0;
              localStorage.setItem("UserID",result.userID);    
              localStorage.setItem("UserName",(inputData['firstname']+" "+inputData['lastname']));
              localStorage.setItem("EmailID",inputData['email']);   
              localStorage.setItem("UserType",result.userDets.user_type);  
              localStorage.setItem("UserCountry",result.userDets.user_country); 
              if(result.userDets.user_timezone!=""){
                localStorage.setItem("UserTimezone",result.userDets.user_timezone);
              } else {
                this.getTimezone(result.userDets.user_country);
              }
              localStorage.setItem("UserImage","");   
              localStorage.setItem("UserEarnedPoints",points);   
              
              this.subscribeTopic();   
                     
              this.btnDis = 0;
              this.router.navigate(['/'])
              .then(() => {
                window.location.reload();
              });
            } else {
              this.btnDis = 0;
              this.authLoader = 0;
              this.showBtn = 1; 
              this.alertPopup=1;
              this.alertPopupMsg=this.translate.instant('login.not_verify_msg'); 
              this.alertPopupImg="assets/images/fail.png";                        
              //this.resetFormGroup();
              //this.router.navigate(['/login']);
            }
          }
        },
        (err:any) => {
          this.btnDis = 0;
          this.authLoader = 0;
          console.log(err);
        }
      );     
  }

  resetFormGroup(){
    this.submitted = false;
    localStorage.setItem("username","");                
    localStorage.setItem("isLogged",<any>false);
    localStorage.setItem("Jwt-token","");		
    localStorage.setItem('signalNext',<any>false);
    localStorage.setItem('signalIndex',<any>0);                

    this.registerForm.reset();
  }  

  subscribeTopic(){                
    /*let st1:any = this.myapp.subscribeTopic('Offer',true);
    console.log(st1);

    let st2:any = this.myapp.subscribeTopic('News',true);
    console.log(st2);*/
  }

  closeAlertPopup(){
    this.alertPopup = 0;
    this.showBtn = 0; 
    this.resetFormGroup();
  }

  resendMail(){
    //alert(this.registerForm.value['username']);
    let input = {username:this.registerForm.value['username']};
    this._service.resendVerifyMail(input)
    .subscribe(
      (data) => {
        console.log("Status Reuslt => ", data);  
        this.showBtn = 0; 
        //this.alertPopupMsg = "Verification Mail Resent Successfully.";         
        this.alertPopupMsg = this.translate.instant('login.mail_resend');
      },
      response => {
        this.authLoader = 0;
        console.log("POST call in error", response);                              
      });
  }

  checkUserStatus(username:any){  
    this._service.checkUserStatus(username)
    .subscribe(
      (data) => {
        console.log("Status Reuslt => ", data);  
        if(data.active == true){
          this.alertPopup = 1;    
          this.authLoader = 0;      
          this.alertPopupMsg = this.translate.instant('login.user_already_exist');  
          this.resetFormGroup();         
        } else {
          this.reActiveUser(username);
        }
      },
      response => {
        this.authLoader = 0;
        console.log("POST call in error", response);                              
      });
  }

  reActiveUser(username:any){  
    let input:any = {username: this.registerForm.value['username'],password: this.registerForm.value['password']};
    this._service.reActiveUser(input)
    .subscribe(
      (data) => {
        console.log("Reactive Reuslt => ", data);  
        if(data.active == true){
          this.getUserDets2(username);
        } else {
          this.alertPopup = 1;      
          this.authLoader = 0;    
          //this.alertPopupMsg = "Registration not completed."; 
          this.alertPopupMsg = this.translate.instant('login.reg_not_complete');
        }
      },
      response => {
        this.authLoader = 0;
        console.log("POST call in error", response);                              
      });
  }

  getUserDets2(username:any){      
    let input:any={username:username,userToken:""};
    this._pageservice.getUserDets(input)
    .subscribe(
      (data) => {
        console.log("User Date Reuslt => ", data);  
        if(!data.userDets == false){
          if(data.userDets.user_verification == 1){
            this.alertPopup = 1;    
            this.authLoader = 0;      
            //this.alertPopupMsg = "Username already exist, If you dont have password? Use forgot password.";  
            this.alertPopupMsg = this.translate.instant('login.user_already_exist');  
            this.resetFormGroup();
          } else {
            this.authLoader = 0; 
            this.alertPopup=1;
            this.alertPopupMsg=this.translate.instant('login.not_verify_msg');
            //this.alertPopupMsg="assets/images/fail.png"; 
            this.resetFormGroup();
          }
        } else {
          this.saveUser('Direct');
        }        
      },
      response => {
        this.authLoader = 0;
        console.log("POST call in error", response);                              
      });
  }

  translationbtn(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.maxHeight = '300px';
    this.dialog.open(TranslationComponent,dialogConfig);
  }


}
