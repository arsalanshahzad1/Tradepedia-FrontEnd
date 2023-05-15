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
import { ThemeService } from '../services/theme.service';

import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { TranslationComponent } from '../translation/translation.component';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {  
  forgotPasswordForm!: FormGroup;
  submitted = false;
  btnDis:number = 0;

  alertPopup:any=0;
  alertPopupMsg:any="";
  alertPopupImg:any="";

  loginthemeLogo:number = 1;

  constructor(
    public dialog: MatDialog,
    private _service : SignalsService, 
    private router : Router, 
    private formBuilder: FormBuilder,
    private themeService: ThemeService,
    public _notification: NotificationService,
    private translate: TranslateService,
    private cookieService: CookieService,  
    private _pageservice: PagesService  
  ) {
    let lang="";
    if(!this.cookieService.get('selectedLang')==true){
      this.cookieService.set('selectedLang','en'); 
      this.translate.use('en');
    } else {
      lang=this.cookieService.get('selectedLang');
      this.translate.use(lang);
    }

    if(this.themeService.theme === 'dark'){
      this.loginthemeLogo = 0;
    }
    else{
      this.loginthemeLogo = 1;
    }
    //alert(this.translate.instant('forgot_pass.process_msg'));
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({                       
      username: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]     
      //username: ['', [Validators.required]]     
    });
  }

  get valid() { return this.forgotPasswordForm.controls; }

  gotoLogin(){
    this.router.navigate(['/login']);
  }

  convertToLower() {
    let email = this.forgotPasswordForm.value['username'];
    email= (email.toLowerCase()).trim();    
    this.forgotPasswordForm.patchValue({
      username : email      
    });
  } 

  resetPassword() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
        return;
    }
    this.btnDis = 1;

    console.log(this.forgotPasswordForm.value);    
    let username=this.forgotPasswordForm.value['username'];

    this.alertPopup=2;        
    this.alertPopupImg="assets/images/validation-error.png";
    //this.alertPopupMsg = "Forgot password in processing, Please wait..";
    this.alertPopupMsg = this.translate.instant('forgot_pass.process_msg');
        
    this._service.forgotPassword(username)
      .subscribe(
        (data) => {
          //alert("In");
          console.log("POST call successful value returned in body", data);
          //alert(data.httpStatusCode);
          if(data.httpStatusCode == 200){
            this.btnDis = 0;
            this.alertPopup=1;        
            this.alertPopupImg="assets/images/validation-error.png";
            //this.alertPopupMsg = data.message;
            this.alertPopupMsg = this.translate.instant('forgot_pass.sent_msg', {username: username});
            //this._notification.success(data.message);
            //this.saveUser(data,password);            
            //this.router.navigate(['/login']);
          }
        },
        response => {
          console.log("POST call in error", response);          
          let msg = response['error']['message'];
          this.btnDis = 0;
          this.alertPopup=1;        
          this.alertPopupImg="assets/images/fail.png";
          if(msg!=""){
            //this._notification.warning(msg);
            this.alertPopupMsg = this.translate.instant('forgot_pass.email_not_found', {username: username});;
            // this.alertPopupMsg = msg;
          } else {
            msg = "Error on forgot password, Try again."
            //this._notification.warning(msg);
            this.alertPopupMsg = msg;
          }                  
      });     
  }

  resetFormGroup(){
    this.submitted = false;
    this.forgotPasswordForm.reset();
  }

  closeAlertPopup(){
    this.alertPopup = 0;
    this.resetFormGroup();
    this.router.navigate(['/login']);
  }

  translationbtn(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.maxHeight = '300px';
    this.dialog.open(TranslationComponent,dialogConfig);
  }


}
