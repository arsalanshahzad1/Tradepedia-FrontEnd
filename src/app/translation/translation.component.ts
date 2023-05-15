import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { PagesService } from '../services/pages.service';
import { ThemeService } from '../services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss']
})
export class TranslationComponent implements OnInit {

  languageList:any=[];
  languageSelected:any="";
  activeIndex: any;
  userID:any="";

  constructor(
    private translate: TranslateService,
    private cookieService: CookieService,
    private router : Router,
    private _service : PagesService,
    private themeService: ThemeService
  ) { 
    //translate.setDefaultLang('en');
    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang'); 
      console.log(this.languageSelected); 
    } else {
      this.languageSelected = "EN";
      this.cookieService.set('selectedLang',this.languageSelected); 
    }  

    translate.setDefaultLang(this.cookieService.get('selectedLang')); 

    if(!localStorage.getItem("UserID")==false){      
      this.userID = localStorage.getItem("UserID");
     }
  }

  ngOnInit(): void {
    if(!this.cookieService.get('languageListArr')==false){
      this.languageList = JSON.parse(this.cookieService.get('languageListArr')); 
      console.log(this.languageList); 
    } else {
      this.getLangList();
    } 

    this.activeIndex = this.languageSelected;
    this.getActiveClass(this.languageSelected);
  }

  //activeIndex;
  changelang(event: string){
    //alert("Trans => "+event);
    this.languageSelected = event;
    this.cookieService.set('selectedLang',event); 
    this.activeIndex = event;
    this._service.setLang(event);
    //alert(event.toLowerCase());
    this.translate.use(event.toLowerCase());   
    //alert(this.translate.currentLang); 
    //this.router.navigate(['/home']); 

    if(this.userID!=""){
      this.setCurrLang();
    }

    this.reloadCurrentRoute();    
    if (this.cookieService.get("selectedLang") === 'AR') {
      //alert("In");
      this._service.setTransAlign(1);
    } else {
      //alert("Out");
      this._service.setTransAlign(0);
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    //alert(currentUrl);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  

  getActiveClass(event: string) {
    return this.activeIndex == event ? 'active' : '';
  }

  setCurrLang(){
    //alert("in");  
    //alert(this.languageSelected);
    let input:any={userID:this.userID,lang:this.languageSelected};  
    this._service.setCurrLang(input)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);                
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  getLangList(){
    //alert("in");    
    this._service.getLangList()
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.languageList = data.langList;                           
        console.log(this.languageList);
        this.cookieService.set('languageListArr',JSON.stringify(this.languageList));
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

}
