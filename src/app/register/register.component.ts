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
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';

import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';
import { PasswordStrengthValidator } from "../validation/password-strength.validators";
import * as CryptoJS from 'crypto-js';
import { ThemeService } from '../services/theme.service';
import { TranslationComponent } from '../translation/translation.component';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  API_URL:string = environment.apiUrl;    
  passwordKey:any = environment.userPasswordKey;
  registerForm!: FormGroup;
  submitted = false;
  btnDis:number = 0;

  hide:boolean = true;

  socialUser!: SocialUser;
  isLoggedin: boolean=false; 

  loginData:any=[]; 
  registerData:any=[];

  showPopup:any=0;
  showPopupMsg:any="";
  showPopupImg:any="";
  langList:any=[];
  countryList:any=[];
  currCountry:any="AE";
  currTimezone:any="";
  languageSelected:any="";

  public ageRange = {
    mask: '00'
  };

  loginthemeLogo:number = 1;

  authLoader:any = 0;
  showBtn:any = 0;

  timeZoneList:any=[]; 

  constructor(
    private _service : SignalsService, 
    private router : Router, 
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    public _notification: NotificationService,
    private translate: TranslateService,
    private cookieService: CookieService,    
    public dialog: MatDialog,
    private socialAuthService: SocialAuthService,
    private _pageservice: PagesService,
  ) {
    this.logout();   
        
    let lang="";
    if(!this.cookieService.get('selectedLang')==true){
      this.cookieService.set('selectedLang','EN'); 
      this.languageSelected = "EN";
      this.translate.use('en');
    } else {
      lang=this.cookieService.get('selectedLang');
      this.languageSelected = lang;
      this.translate.use(lang.toLowerCase());
    }   

    if(!this.cookieService.get('languageListArr')==false){
      this.langList = JSON.parse(this.cookieService.get('languageListArr')); 
      console.log(this.langList); 
    } else {
      this.getLangList();
    }    
    console.log(this.langList);

    this.getCountryList();   

    if(this.themeService.theme === 'dark'){
      this.loginthemeLogo = 0;
    }
    else{
      this.loginthemeLogo = 1;
    }

    this.getGeoLocation();
  }

  ngOnInit(): void {    
    this.registerForm = this.formBuilder.group({                       
        provider: ['Direct'],
        referID: [''],
        mailid: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        username: [''],
        //password: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', Validators.compose([
          Validators.required, Validators.minLength(8), PasswordStrengthValidator])],
        firstname: ['',[Validators.required]],
        lastname: ['',[Validators.required]],
        age: ['',[Validators.required,Validators.min(1)]],
        gender: [''],
        country: [this.currCountry, [Validators.required]],
        language: [this.languageSelected],
        timezone: [this.currTimezone],
        userToken: [''],
        autosignal: [1],
        newsignal: [1],
        cancelled: [1],
        activated: [1],
        getready: [0],
        target1: [1],
        target2: [1],
        target3: [1],
        stoploss: [0],
        offer: [1],
        news: [1],
        agree: ['', [Validators.required]]      
    });    

    this.getLocation();    

    this.socialAuthService.authState.subscribe((user) => {
      console.log("socialAuthService starts");
      this.socialUser = user;
      this.isLoggedin = (user != null);
      console.log(this.socialUser);   
      
      if(this.socialUser.provider=="GOOGLE"){
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
            gender: '',
            country: this.currCountry,
            timezone: this.currTimezone,
            language: this.languageSelected, 
            autosignal:1,
            newsignal: 1,
            cancelled: 1,
            activated: 1,
            getready: 0,
            target1: 1,
            target2: 1,
            target3: 1,
            stoploss: 0,
            offer: 1,
            news: 1,
            agree: 1       
        };

        /*let tempUser="google10@mail.com";
        this. registerData = {                    
            provider: this.socialUser.provider,
            referID: this.socialUser.id,
            mailid: tempUser,
            username: tempUser,
            password: randPwd,
            firstname: 'Google',
            lastname: 'User 10',
            age: '',
            gender: '',
            autosignal:1,
            newsignal: 1,
            cancelled: 1,
            activated: 1,
            getready: 0,
            target1: 1,
            target2: 1,
            target3: 1,
            stoploss: 1,
            offer: 1,
            news: 1,
            agree: 1         
        };*/
        console.log(this.registerData);        

        this.getSocialUserDets(tempUser);
      }
    });
  }

  getCountryLang(){
    let country:any=this.registerForm.value['country'];     
    //alert(country);
    for(let i=0;i<this.countryList.length;i++){
      if(this.countryList[i].country_2code == country){
        //alert(this.countryList[i].country_language);
        this.timeZoneList = this.countryList[i].timezoneArr;
        this.registerForm.patchValue({                    
          language: this.countryList[i].country_language,
          timezone: this.timeZoneList[0].ctz_value                                      
        });
        break;
      }
    }
  }

  getLocation() {
    this._pageservice.getGeoLoc().subscribe((data:any) => {
        console.log(data)
        this.currCountry = data.country;
        this.registerForm.patchValue({                    
          country: this.currCountry                      
        });
    });
  }

  filterMsg(arrlist: any[],type:any): any {  
    if (!arrlist || !type) {
        return arrlist;
    }    
    return arrlist.filter((item:any) => (item === type) == true);
  }

  getGeoLocation() {
    //alert(localStorage.getItem("DeviceIP"));    
    //alert("In");
    /*let ip:any=localStorage.getItem("DeviceIP");
    this._pageservice.getLocation(ip).subscribe((data:any) => {
        //alert("Result");
        console.log(data);
        this.currCountry = data.country.isoAlpha2;
        //alert(this.currCountry);
        this.registerForm.patchValue({                    
          country: this.currCountry                      
        });
    });*/
  }

  getLangList(){
    //alert("in");    
    this._pageservice.getLangList()
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.langList = data.langList;                           
        console.log(this.langList);
        localStorage.setItem('languageListArr',JSON.stringify(this.langList));
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  get valid() { return this.registerForm.controls; }

  logout(): void{       
    let token = localStorage.getItem("Jwt-token");
    let username = localStorage.getItem("username");
    let lang:any = this.cookieService.get('selectedLang');

    this.socialAuthService.signOut();    

    if(!token==false){
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
            //this._notification.warning("Oop's error an process");
            this.router.navigate(['/login']);
          }
      );
    }    
  }

  loginWithGoogle(): void {
    console.log("loginWithGoogle starts");
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  logOut(): void {
    this.socialAuthService.signOut();
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

            localStorage.setItem("UserType",result.socialDets.user_type);  

            this.loginData = {
              username: result.socialDets.user_username,
              password: result.socialDets.password 
            }
            this.userLogin('Social');
          } else {
            this.socialRegister(); 
          }          
        },
        (err:any) => {
          this.btnDis = 0;
          console.log;
        }
      );    
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.btnDis = 1;
   
    console.log(this.registerForm.value);   
   
    //const dialogRef = this.dialog.open(RegisterPop);

    //dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
      //alert(result);

      this.registerForm.patchValue({                    
        username:this.registerForm.value['mailid']          
      });

      if(this.registerForm.value['agree']==1){
        //this._notification.longMsg("Registration going on, Please wait.");
        this.authLoader = 1;
        this.showPopup = 1;
        this.showPopupImg = "assets/images/validation-error.png";
        //this.showPopupMsg = "Registration going on, Please wait.";   
        this.showPopupMsg = this.translate.instant('register.register_msg')     

        let user:any={"email": this.registerForm.value['mailid'],"username": this.registerForm.value['username'],"password": this.registerForm.value['password'],"firstname": this.registerForm.value['firstname'],"lastname": this.registerForm.value['lastname']};
        //let user:any=this.registerForm.value;
        console.log(user);
        this._service.register(user)
          .subscribe(
            (data:any) => {
              console.log("POST call successful value returned in body", data);
              if(data.active == true){
               //this._notification.success("Registration Completed Successfully.");
                //this.showPopupMsg = "Registration Completed Successfully.";
                this.showPopupMsg = this.translate.instant('register.register_complete')
                this.saveUser('Direct');
              }
            },
            (response:any) => {
              console.log("POST call in error", response);   
              this.btnDis = 0;   
              this.authLoader = 0;    
              let msg = response['error']['message'];
              this.showPopupImg = "assets/images/fail.png";
              //alert(msg);
              if(msg!=""){
                if(msg=="Username already exists"){
                  this.authLoader = 1;   
                  this.checkUserStatus(this.registerForm.value['mailid'],'Direct');
                } else {
                  this.showPopupMsg = msg+", Try again.";        
                }
                //this.showPopupMsg = msg+", Try again.";
                //this._notification.warning(msg);                
              } else {
                //msg = "Error on registration, Try again.";
                msg = this.translate.instant('register.register_error');
                //this._notification.warning(msg);
                this.showPopupMsg = msg;    
                
              }                
            });     
      } else if(this.registerForm.value['agree']==0){       
        this.showPopup = 1;
        this.showPopupImg = "assets/images/fail.png";
        //this.showPopupMsg = "Please agree our terms & conditions";    
        this.showPopupMsg = this.translate.instant('register.termsandcond')    
        //this._notification.warning("Registration Cancelled");
        this.resetFormGroup();
      }
    //});
  }

  deActicateUser(username:any,type:any){  
    //alert("Deactivate =>"+username);
    this._service.deActiveUser(username)
    .subscribe(
      (data) => {
        console.log("Deactivate Reuslt => ", data);  
        console.log(data);  
        if(data.active == false){
          this.reActiveUser(type);
        }
      },
      response => {
        this.authLoader = 0;
        console.log("POST call in error", response);                              
      });
  }

  checkUserStatus(username:any,type:any){  
    //alert(username);
    this._service.checkUserStatus(username)
    .subscribe(
      (data) => {
        console.log("Status Reuslt => ", data);  
        console.log(data);  
        if(data.active == true){
          if(type=="Social"){
            this.deActicateUser(username,type);
          } else {
            this.showPopup = 1;    
            this.authLoader = 0;      
            //this.showPopupMsg = "Username already exist, If you dont have password? Use forgot password.";  
            this.showPopupMsg = this.translate.instant('register.user_already_exist')
            this.resetFormGroup();         
          }
        } else {
          this.reActiveUser(type);
        }
      },
      response => {
        this.authLoader = 0;
        console.log("POST call in error", response);                              
      });
  }

  reActiveUser(type:any){  
    let input:any = [];
    if(type=="Social"){
      //alert("Reactive => "+this.registerData['username']+" "+this.registerData['password']);
      input = {username: this.registerData['username'],password: this.registerData['password']};
    } else {
      //alert("Reactive => "+this.registerForm.value['username']+" "+this.registerForm.value['password']);
      input = {username: this.registerForm.value['username'],password: this.registerForm.value['password']};
    }
    this._service.reActiveUser(input)
    .subscribe(
      (data) => {
        console.log("Reactive Reuslt => ", data);  
        console.log(data);  
        if(data.active == true){
          this.getUserDets(type);
        } else {
          this.showPopup = 1;      
          this.authLoader = 0;    
          //this.showPopupMsg = "Registration not completed."; 
          this.showPopupMsg = this.translate.instant('register.reg_not_complete')
        }
      },
      response => {
        this.authLoader = 0;
        console.log("POST call in error", response);                              
      });
  }

  getUserDets(type:any){          
    let input:any=[];
    if(type=="Social"){
      //alert("Get Dets => "+this.registerData['username']);
      input={username:this.registerData['username'],provider:this.registerData['provider'],userToken:""};
    } else {
      //alert("Get Dets => "+this.registerForm.value['username']);
      input={username:this.registerForm.value['username'],provider:this.registerForm.value['provider'],userToken:""};
    }
    this._pageservice.getUserDets(input)
    .subscribe(
      (data) => {
        console.log("User Date Reuslt => ", data);
        console.log(data);  
        //alert(!data.userDets);
        if(!data.userDets == false){
          if(data.userDets.user_verification == 1){
            this.showPopup = 1;    
            this.authLoader = 0;      
            //this.showPopupMsg = "Username already exist, If you dont have password? Use forgot password.";  
            this.showPopupMsg = this.translate.instant('register.user_already_exist')
            this.resetFormGroup();
          } else {
            this.authLoader = 0; 
            this.showPopup=1;
            this.showBtn = 1;
            //this.showPopupMsg="User Email ID not verified, Please check your mail.";
            this.showPopupMsg = this.translate.instant('register.not_verify_msg')
            //this.showPopupMsg="assets/images/fail.png"; 
            //this.resetFormGroup();
          }
        } else {
          //alert("Going to Save");
          this.saveUser(type);
        }        
      },
      response => {
        this.authLoader = 0;
        console.log("POST call in error", response);                              
      });
  }

  resendMail(){
    //alert(this.registerForm.value['username']);
    let input = {username:this.registerForm.value['username']};
    this._service.resendVerifyMail(input)
    .subscribe(
      (data) => {
        console.log("Status Reuslt => ", data);  
        this.showBtn = 0; 
        //this.showPopupMsg = "Verification Mail Resent Successfully.";      
        this.showPopupMsg = this.translate.instant('register.mail_resend')           
      },
      response => {
        this.authLoader = 0;
        console.log("POST call in error", response);                              
      });
  }

  socialRegister() {
    
        //this._notification.longMsg("Registration going on, Please wait.");
        this.showPopup = 1;
        this.showPopupImg = "assets/images/validation-error.png";
        //this.showPopupMsg = "Registration going on, Please wait.";
        this.showPopupMsg = this.translate.instant('register.register_msg')

        //let user:any={"email": this.registerForm.value['mailid'],"username": this.registerForm.value['username'],"password": this.registerForm.value['password'],"firstname": this.registerForm.value['firstname'],"lastname": this.registerForm.value['lastname']};
        let user:any={"email": this.registerData['mailid'],"username": this.registerData['username'],"password": this.registerData['password'],"firstname": this.registerData['firstname'],"lastname": this.registerData['lastname']};
        //let user:any=this.registerForm.value;
        console.log(user);
        this.authLoader = 1;
        this._service.register(user)
          .subscribe(
            (data:any) => {
              console.log("POST call successful value returned in body", data);
              if(data.active == true){
                //this._notification.success("Registration Completed Successfully.");
                //this.showPopupMsg = "Registration Completed Successfully.";
                this.showPopupMsg = this.translate.instant('register.register_complete')
                this.saveUser('Social');
              }
            },
            (response:any) => {
              console.log("POST call in error", response);   
              this.btnDis = 0;     
              this.authLoader = 0;
              this.showPopup = 1;
              this.showPopupImg = "assets/images/fail.png";  

              let msg = response['error']['message'];
              if(msg!=""){
                if(msg=="Username already exists"){
                  this.authLoader = 1;   
                  //this.checkUserStatus(this.registerData['username']);
                  this.checkUserStatus(this.registerData['username'],'Social');
                } else {
                  this.showPopupMsg = msg+", Try again.";        
                }
                //this._notification.warning(msg);
                //this.showPopupMsg = msg; 
              } else {
                //msg = "Error on registration, Try again."
                msg = this.translate.instant('register.register_error');
                //this._notification.warning(msg);
                this.showPopupMsg = msg; 
                
              }                
            });     
    
  }

  saveUser(type:any){
    //alert("In");
    console.log(this.registerForm.value); 	
    //let userDet=<any>{"name": data['firstname']+" "+data['lastname'],"email": data['email'],"username": data['username']};
    //this._notification.longMsg("User Saving going on, Please wait.");
    this.showPopup = 1;
    this.showPopupImg = "assets/images/validation-error.png";
    //this.showPopupMsg = "User Saving going on, Please wait.";
    this.showPopupMsg = this.translate.instant('register.save_going')

    let userDet:any=[];
    if(type=="Social"){     
      userDet = {                       
          provider: this.registerData.provider,
          referID: this.registerData.referID,
          mailid: this.registerData.mailid,
          username: this.registerData.username,        
          password: this.registerData.password,
          firstname: this.registerData.firstname,
          lastname: this.registerData.lastname,
          age: this.registerData.age,
          gender: this.registerData.gender,
          country: this.currCountry,
          timezone: this.currTimezone,
          language: this.languageSelected, 
          userToken: "",
          autosignal: 1,
          newsignal: 1,
          cancelled: 1,
          activated: 1,
          getready: 0,
          target1: 1,
          target2: 1,
          target3: 1,
          stoploss: 0,
          offer: 1,
          news: 1,
          agree: 1     
      }; 
    } else {
      userDet=this.registerForm.value;
    }    
    console.log(userDet);
    
    this._service.saveUser(userDet)
      .subscribe(
        (data:any) => {
          console.log(data);                    
          let result = data;
          if(result.userID!=""){    
            this.authLoader = 0;         
            localStorage.setItem("UserID",result.userID);    
            //alert(result.userID); 	
            localStorage.setItem("UserEarnedPoints",<any>parseFloat(result.userPoints));
            localStorage.setItem("UserType",result.userDets.user_type);   
            localStorage.setItem("UserCountry",result.userDets.user_country);
            localStorage.setItem("UserTimezone",result.userDets.user_timezone);    
            localStorage.setItem("UserCountry",result.userDets.user_country);
            localStorage.setItem("UserTimezone",result.userDets.user_timezone);  	                          
            
            //this._notification.longMsg("User Saved, Please wait until register.");
            //this.showPopupMsg = "User saved successfully, Please check your mail.";
            this.showPopupMsg = this.translate.instant('register.usersave')
            this.subscribeTopic();
            //this.userLogin();

            this.updateUserAccess(result.userID);

            /*setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);*/

            if(type=="Social"){ 
              //this.showPopupMsg = "User saved successfully.";
              this.showPopupMsg = this.translate.instant('register.reguser_saved');
              this.loginData = {
                username: this.registerData.username,
                password: this.registerData.password 
              }
              //alert("Going to Login");
              this.userLogin('Social');              
            } else { 
              //this.showPopupMsg = "User saved successfully, Please check your mail.";
              this.showPopupMsg = this.translate.instant('register.reguser_saved_mail');
              setTimeout(() => {
                this.router.navigate(['/login']);
              },2000);
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

  subscribeTopic(){                
    //let st1:any = this.myapp.subscribeTopic('Offer',true);
    //console.log(st1);

    //let st2:any = this.myapp.subscribeTopic('News',true);
    //console.log(st2);
  }

  gotoHome(){
    this.router.navigate(['/home']);
  }

  userLogin(type:any){    
    //let inputDets:any={username:this.registerForm.value['username'],password:this.registerForm.value['password']};
    let inputDets:any=[];
    if(type=="Social"){
      inputDets={username: this.loginData.username,password: this.loginData.password};
    } else {
      inputDets={username:this.registerForm.value['username'],password:this.registerForm.value['password']};
    }
    this.authLoader = 1;
    this._service.userLogin(inputDets)
    .subscribe(
      (data) => {
        console.log("Login Reuslt => ", data);             
          let result:any = data.body;
          let requ:any = data.headers.get('jwt-token');
          console.log(result); 
          console.log(requ);

          let isLogged:any=true;
          let next:any=false;
          let index:any=0;

          //this._notification.success("User Created and Logged Successfully.");
          //this.showPopupMsg = "User Created and Logged Successfully.";
          this.showPopupMsg = this.translate.instant('register.create_login')
                    
          //localStorage.setItem("UserID","");
          localStorage.setItem("UserName",(result.firstname+" "+result.lastname));
          localStorage.setItem("EmailID",result.email);
          localStorage.setItem("username",inputDets['username']);
          //localStorage.setItem("password",inputDets['password']);
          localStorage.setItem("isLogged",isLogged);
          localStorage.setItem("Jwt-token",requ);		
          localStorage.setItem('signalNext',next);
          localStorage.setItem('signalIndex',index);
          localStorage.setItem('profileMode',"");
          localStorage.setItem('profileEditIndex',"");
          localStorage.setItem("notificationListArr",JSON.stringify([]));          
          //this.showPopup = 0;

          localStorage.setItem("loginStatus",result.loginStatus);
          localStorage.setItem("UserSignalLastID",<any>0);     
          localStorage.setItem("UserOfferLastID",<any>0);     
          localStorage.setItem("UserNewsLastID",<any>0);  
          localStorage.setItem("UserSquawkStatus",<any>0);  
          localStorage.setItem("UserCountry",result.userDets.user_country); 
          localStorage.setItem("UserTimezone",result.userDets.user_timezone);   

          let password = CryptoJS.AES.encrypt(inputDets['password'], this.passwordKey).toString();
          console.log(password);
          
          this.cookieService.set('username',inputDets['username']);
          this.cookieService.set('password',password);
         
          //this.router.navigate(['/home']);
          this.getUserDets2(result);
      },
      response => {
        this.authLoader = 0;
        console.log("POST call in error", response);                              
      });
  }  

  getUserDets2(inputData:any){
    //alert("Login")
    console.log(inputData);
    let userToken:any="";
    if(!localStorage.getItem('UserToken')==false){
      userToken=localStorage.getItem('UserToken');
    }
    let input:any={username:inputData.username,userToken:userToken};
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
                localStorage.setItem("LoginProvider",result.userDets.user_provider);     
                localStorage.setItem("UserType",result.userDets.user_type);                          	                          
                localStorage.setItem("UserEarnedPoints",<any>parseFloat(result.userDets.user_earned_points));     	                          
                localStorage.setItem("notificationListArr",JSON.stringify([]));
                localStorage.setItem("UserSignalLastID",<any>0);     
                localStorage.setItem("UserOfferLastID",<any>0);     
                localStorage.setItem("UserNewsLastID",<any>0);  
                localStorage.setItem("UserSquawkStatus",result.userDets.user_issquawk_member);     
                localStorage.setItem("loginStatus",result.loginStatus);
                localStorage.setItem("UserCountry",result.userDets.user_country); 
                localStorage.setItem("UserTimezone",result.userDets.user_timezone); 
                localStorage.setItem("UserXmAccNo",result.userDets.user_xmacno); 

                this.btnDis = 0;     
                this.getUserNoteCount(result.userDets.user_id);   
                this.updateUserAccess(result.userDets.user_id);
                
                this.router.navigate(['/home']);                                
              } else {                
                this.btnDis = 0;      
                this.authLoader = 0;
                this.showBtn = 1;
                this.showPopup=1;
                //this.alertPopupMsg="User Email ID not verified, Please check your mail.";
                this.showPopupMsg=this.translate.instant('login.not_verify_msg');
                //this.showPopupImg="assets/images/fail.png"; 
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
            this.showPopup=1;
            //this.alertPopupMsg="Your account is inactive, Unable to login.";
            this.showPopupMsg=this.translate.instant('login.inactive_nologin');            
            //this.showPopupImg="assets/images/fail.png"; 
          }      
        },
        (err) => {
          this.btnDis = 0;
          this.authLoader = 0;
          console.log;
        }
      );    
  }

  updateUserAccess(userID:any){
    this._pageservice.updateUserAccess({userID:userID})
    .subscribe( (data:any) => {
      console.log(data);
    });
  }

  getUserNoteCount(userID:any){
    //alert("in");    
    let userDets:any={userID:userID};
    console.log(userDets);  
    this._pageservice.getUserNoteCount(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);  
        let signalCount:any=data.newSignalCount;
        let newsCount:any=data.newNewsCount;
        let offerCount:any=data.newOfferCount;    
        let newTotalCount:any=data.newTotalCount;    

        localStorage.setItem("SignalNoteCount",signalCount);
        localStorage.setItem("NewsNoteCount",newsCount);
        localStorage.setItem("OfferNoteCount",offerCount);        
        localStorage.setItem("DisplayNoteCount",newTotalCount);
        localStorage.setItem("RetNoteCount",newTotalCount);  
        
        this._pageservice.setNoteCount(newTotalCount);
        this._pageservice.setSignalCount(signalCount);
        this._pageservice.setOfferCount(offerCount);
        this._pageservice.setNewsCount(newsCount);
      },
      response => {        
        console.log("POST call in error", response);                              
      });
  }
  
  resetFormGroup(){
    this.submitted = false;
    this.registerForm.reset();
    this.registerForm.patchValue({                    
      provider: 'Direct',
      country: this.currCountry,
      timezone: this.currTimezone,
      language: this.languageSelected 
    });
  }  

  customerSignupbtn(){
    this.router.navigate(['/login']);
  }

  closePaynowpopup(){
    this.showPopup = 0;
    this.showBtn = 0;
    this.router.navigate(['/login']);
  }

  convertToLower() {
    let email = this.registerForm.value['mailid'];
    email= (email.toLowerCase()).trim();    
    this.registerForm.patchValue({
      mailid : email      
    });
  } 

  translationbtn(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.maxHeight = '300px';
    this.dialog.open(TranslationComponent,dialogConfig);
  }

  getCountryList(){          
    let input:any=[];    
    this._pageservice.getCountryList(input)
    .subscribe(
      (data) => {
        console.log("Country Reuslt => ", data);
        console.log(data);    
        this.countryList = data.countryList;    
        for(let i=0;i<this.countryList.length;i++){
          if(this.countryList[i].country_2code == this.registerForm.value['country']){
            //alert("In");
            this.timeZoneList = this.countryList[i].timezoneArr;
            //alert(this.timeZoneList[0].ctz_value);
            this.registerForm.patchValue({                    
              timezone: this.timeZoneList[0].ctz_value                
            });
          }
        }
        console.log(this.timeZoneList)          
      },
      response => {
        this.authLoader = 0;
        console.log("POST call in error", response);                              
      });
  }

}

@Component({
  selector: 'register-pop',
  templateUrl: './register-pop.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterPop implements OnInit{

  constructor(
    private router : Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegisterPop>,
  ) { }

  ngOnInit(): void {
  }
  
  gotoSignuptwo(){
    this.dialog.closeAll();
    //alert('Register Completed');
    this.dialogRef.close(1);
  }

  closePopup(){
    this.dialog.closeAll();
    this.dialogRef.close(0);
  }

}
