import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
  languageSelected:any="";
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  analysisList:any=[];

  //Analysis Details
  langCode:any="";
  analysisID:any="";  
  analysisDets:any=""; 

  constructor(
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
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
  }

  ngOnInit(): void {
    this.getAnalysisList();     
  }

  getAnalysisList(){
    //alert("in");    
    let lang:any={langCode:this.languageSelected};
    this._service.getAnalysisList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.analysisList = data.analysisList;                    
        for(let i=0;i<this.analysisList.length;i++){
          this.analysisList[i].imgSrc = this.imgURL+"analysis/"+this.analysisList[i].analysis_cover_image
        }
        console.log(this.analysisList);
        this.analysisDets = this.analysisList[0];
        console.log(this.analysisDets);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  gotoDetails(input:any){
    console.log(input);
    this.analysisDets = input;
    console.log(this.analysisDets);      
  }  
}
