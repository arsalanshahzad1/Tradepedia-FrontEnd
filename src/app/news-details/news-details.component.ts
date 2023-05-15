import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.scss']
})
export class NewsDetailsComponent implements OnInit {
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  
  langCode:any="";
  newsID:any="";  
  newsDets:any="";  

  constructor(
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false){
          //this.getCouponDets(params['code']);
          this.newsID=params['code'];
          this.langCode=params['lang'];
          this.getNewsDets();          
        }
    });
  }

  getNewsDets(){
    //alert("in");    
    let inputDets:any={code:this.newsID,langCode:this.langCode}
    this._service.getNewsDets(inputDets)
    .subscribe(
      (data) => {
        console.log("News Details Reuslt => ", data);        
        this.newsDets = data.newsDets;     
        this.newsDets.imgSrc = this.imgURL+"news/"+this.newsDets.news_cover_image                       
        console.log(this.newsDets);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }
  
}
