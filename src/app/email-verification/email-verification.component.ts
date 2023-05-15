import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagesService } from '../services/pages.service';
import { SignalsService } from '../services/signals.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {

  inputCode:any="";
  showContent:any=0;
  constructor(
    private _service : PagesService,
    private route: ActivatedRoute,
    private _sigservice : SignalsService,
    private router : Router, 
  ) { 
    this.logout();
  }

  ngOnInit(): void {
    localStorage.clear();
    
    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false){
          //this.getCouponDets(params['code']);
          this.inputCode=params['code'];          
          this.checkUserDets();          
        }
    });  
  }

  
  logout(): void{       
    let token = localStorage.getItem("Jwt-token");
    let username = localStorage.getItem("username");       

    if(!token==false){
      this._sigservice.logout(token,username)
      .subscribe(
          (data:any) => {                        
            console.log(data);                        
            localStorage.clear();                        
          },
          (err:any) => {
            console.log(err);
            localStorage.clear();            
          }
      );
    }    
  }

  checkUserDets(){
    //alert("in");    
    let input:any={inputCode:this.inputCode};
    this._service.checkUserDets(input)
    .subscribe(
      (data) => {
        console.log("Reuslt => ", data); 
        if(data.status==1){
          this.showContent=1;
        } else if(data.status==2){
          this.showContent=2;
        }               
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

}
