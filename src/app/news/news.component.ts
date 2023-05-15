import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  languageSelected:any="";
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  newsList:any=[];
  newsDets:any="";  

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
    this.getNewsList();
  }

  getNewsList(){
    //alert("in");    
    let lang:any={langCode:this.languageSelected};
    this._service.getNewsList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.newsList = data.newsList;                    
        for(let i=0;i<this.newsList.length;i++){
          this.newsList[i].imgSrc = this.imgURL+"news/"+this.newsList[i].news_cover_image
        }
        console.log(this.newsList);
        this.newsDets = this.newsList[0];
        console.log(this.newsDets);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  gotoDetails(input:any){
    console.log(input);
    this.newsDets = input;
    console.log(this.newsDets);        
  }

}
