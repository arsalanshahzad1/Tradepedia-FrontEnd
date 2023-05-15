import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PagesService } from '../services/pages.service';
import { Router } from '@angular/router';
import { TranslationComponent } from '../translation/translation.component';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrls: ['./my-transactions.component.scss']
})
export class MyTransactionsComponent implements OnInit {
  currCode:any = environment.CurrCode;
  userName:any="";
  userPoints:any="";
  totalPoints:any="";  
  userID:any="";

  quizList:any="";
  tnxList:any="";
  buyList:any="";  
  purList:any="";
  referArr:any="";
  giftList:any="";
  languageSelected:any="";
  timeZone:any="";

  constructor(
    private router : Router,
    private translate: TranslateService,
    private cookieService: CookieService,
    private _service : PagesService
  ) {
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }

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
    
    this.userID = localStorage.getItem("UserID");   
    this.userName = localStorage.getItem("UserName"); 
    this.userPoints = localStorage.getItem("UserEarnedPoints"); 
  }

  ngOnInit(): void {
    this.getPointsSummary();
  }

  getPointsSummary(){
    //alert("in");    
    let userDets:any={userID:this.userID,limit:30,lang:this.languageSelected};
    this._service.getPointsSummary(userDets)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.quizList = data.quizList;
        this.tnxList = data.tnxList; 
        this.referArr = data.referArr; 
        this.buyList = data.buyList; 
        this.purList = data.purList;  
        this.giftList = data.giftList;                           

        for(let i=0;i<this.quizList.length;i++){
          this.quizList[i].base_date2 = (this.quizList[i].base_date.replace(" ","T"))+"Z";
        }
        
        for(let i=0;i<this.tnxList.length;i++){
          this.tnxList[i].base_date2 = (this.tnxList[i].base_date.replace(" ","T"))+"Z";
        }                
         
        for(let i=0;i<this.buyList.length;i++){
          this.buyList[i].base_date2 = (this.buyList[i].base_date.replace(" ","T"))+"Z";
        }                
        
        for(let i=0;i<this.purList.length;i++){
          this.purList[i].base_date2 = (this.purList[i].base_date.replace(" ","T"))+"Z";
        }                
        
        for(let i=0;i<this.referArr.length;i++){
          this.referArr[i].base_date2 = (this.referArr[i].base_date.replace(" ","T"))+"Z";
        }  
        
        for(let i=0;i<this.giftList.length;i++){
          this.giftList[i].base_date2 = (this.giftList[i].base_date.replace(" ","T"))+"Z";
        }
        
        console.log(this.quizList);  
        console.log(this.tnxList);   
        console.log(this.buyList);   
        console.log(this.purList);
        console.log(this.referArr);  
        console.log(this.giftList);          
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  gotoWallet(input:any){
    this._service.setWalletPart(input);
  }

}
