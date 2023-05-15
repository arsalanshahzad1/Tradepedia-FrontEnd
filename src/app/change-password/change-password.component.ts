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

import { PasswordStrengthValidator } from "../validation/password-strength.validators";


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  hide1:boolean = true;
  hide2:boolean = true;
  hide3:boolean = true;

  changePasswordForm!: FormGroup;
  submitted = false;
  btnDis:number = 0;
  showPopup:any=0;

  constructor(
    private _service : SignalsService, 
    private router : Router, 
    private formBuilder: FormBuilder,
    public _notification: NotificationService,
    private translate: TranslateService,
    private cookieService: CookieService,  
    private _pageservice: PagesService  
  ) {
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    let lang="";
    if(!this.cookieService.get('selectedLang')==true){
      this.cookieService.set('selectedLang','en'); 
      this.translate.use('en');
    } else {
      lang=this.cookieService.get('selectedLang');
      this.translate.use(lang);
    }
   }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({                       
      currpassword: ['', [Validators.required, Validators.minLength(8)]],
      newpassword: ['', Validators.compose([
        Validators.required, Validators.minLength(8), PasswordStrengthValidator])],
      conpassword: ['', Validators.compose([
        Validators.required, Validators.minLength(8), PasswordStrengthValidator])],    
    }, {
      validator: this._service.mustMatch('newpassword', 'conpassword')
    });
  }

  get valid() { return this.changePasswordForm.controls; }

  gotoLogin(){
    this.router.navigate(['/login']);
  }

  updatepassword(){    
    this.submitted = true;

    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
        return;
    }
    this.btnDis = 1;
    console.log(this.changePasswordForm.value);      
    var username=localStorage.getItem("username");

    let user:any={"currentUsername":username,"currentPassword":this.changePasswordForm.value['currpassword'],"password":this.changePasswordForm.value['newpassword']};

    console.log(user); 
    this._service.updatepassword(user)
      .subscribe(
        (data:any) => {
          console.log("POST call successful value returned in body", data);
          if(!data==false){
            this.btnDis = 0;
            this.showPopup = 1;
          }
        },
        (response:any) => {
          console.log("POST call in error", response);          
          this.btnDis = 0;
          let msg = response['error']['message'];
          if(msg!=""){
            msg=this.translate.instant('change_pass.err_msg');
            this._notification.warning(msg);
          } else {
            //msg = "Error on registration, Try again."
            msg=this.translate.instant('change_pass.err_onprocess');
            this._notification.warning(msg);
          }                  
    });
  }

  resetFormGroup(){
    this.submitted = false;
    this.changePasswordForm.reset();
  }

  closePaynowpopup(){
    this.showPopup = 0;
    this.hide1 = true;
    this.hide2 = true;
    this.hide3 = true;
    this.resetFormGroup();
  }

  gotoPage(url:any){
    this.router.navigate([url]);    
  }
  
}
