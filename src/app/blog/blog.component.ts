import { Component, OnInit } from '@angular/core';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  languageSelected:any="";
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  blogList:any=[];
  blogDets:any="";

  showPopup = 0;
  userID:any="";
  userPoints:any="";
  userSplRptStatus:any="";
  timeZone:any="";

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
    
    if(!localStorage.getItem("UserID")==false){
      this.userID =localStorage.getItem("UserID");        
    }
    this.userPoints = localStorage.getItem("UserEarnedPoints");

    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang');        
    } else {
      this.languageSelected = "EN";      
    } 
    console.log(this.languageSelected);

    if(!localStorage.getItem("UserTimezone")==false){
      this.timeZone = localStorage.getItem("UserTimezone");        
    } else {
      this.timeZone="+0000";
    }   
  }

  ngOnInit(): void {
    this.getBlogList();
  }

  getBlogList(){
    //alert("in");      
    let lang:any={langCode:this.languageSelected,userID:this.userID};
    this._service.getBlogList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.blogList = data.blogList;     
        this.userSplRptStatus = data.splReportStatus;               
        for(let i=0;i<this.blogList.length;i++){
          this.blogList[i].blog_published_on2 = (this.blogList[i].blog_published_on.replace(" ","T"))+"Z";          
          this.blogList[i].imgSrc = this.imgURL+"blog/"+this.blogList[i].blog_cover_image
        }
        console.log(this.blogList);
        this.gotoDetails(this.blogList[0]);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  gotoDetails(input:any){
    console.log(input);
    if(this.userSplRptStatus==1){
      this.blogDets = input;   
      console.log(this.blogDets);    
    } else {
      this.showPopup = 1;  
    }    
  }
  
  gotoPaynowpopup(){
    this.showPopup = 1;
  }
  closePaynowpopup(){
    this.showPopup = 0;
  }

  gotoblogPlan(){
    this.router.navigate(['/blog-plan'])
  }

}
