import { Component, OnInit } from '@angular/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-guide',
  templateUrl: './video-guide.component.html',
  styleUrls: ['./video-guide.component.scss']
})
export class VideoGuideComponent implements OnInit {
  languageSelected:any="";
  
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;

  mode: ProgressSpinnerMode = 'determinate';
  value = 0;

  userID:any="";
  lessonList:any=[];
  selectedGuide:any="";
  videoID:any=""; 
  langCode:any=""; 

  guideQuizDets:any=[];
  lessonCompleted:number=0;

  constructor(
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    public sanitizer: DomSanitizer
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    if(!localStorage.getItem("UserID")==false){
      this.userID =localStorage.getItem("UserID");        
    }

    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang');        
    } else {
      this.languageSelected = "EN";      
    } 
    console.log(this.languageSelected);
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false){
          //this.getCouponDets(params['code']);
          this.videoID=params['code'];        
          this.langCode=params['lang'];        
          this.getLessonList();          
        }
    });       
  }
  
  getLessonList(){
    //alert("in");    
    let lang:any={code:this.videoID,langCode:this.langCode}
    this._service.getLessonList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.lessonList = data.lessonList;   

        if(this.lessonList.length > 0){
          this.getGuideQuizDets();          
        }

        for(let i=0;i<this.lessonList.length;i++){
          this.lessonList[i].fileSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.lessonList[i].lesson_url);                       

          this.lessonList[i].stars = 0;
        }                         
        console.log(this.lessonList);
        this.selectedGuide = this.lessonList[0];
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  getGuideQuizDets(){
    //alert("in");    
    let ebookDets:any={userID:this.userID, videoID:this.videoID};
    this._service.getGuideQuizDets(ebookDets)
    .subscribe(
      (data) => {
        console.log("Ebook Quiz Reuslt => ", data);        
        this.guideQuizDets = data.guideQuizDets;     
        this.lessonCompleted = parseInt(this.guideQuizDets.length);    
                   
        for(let i=0;i<this.lessonList.length;i++){
          for(let q=0;q<this.guideQuizDets.length;q++){
            if(this.lessonList[i].lesson_vguides_code == this.guideQuizDets[q].lresult_vguides_code && this.lessonList[i].lesson_code == this.guideQuizDets[q].lresult_lesson_code){
              this.lessonList[i].stars = this.guideQuizDets[q].lresult_total_stars;  
            }            
          }
        }
        //alert(this.lessonCompleted);
        console.log(this.lessonList);        
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  selectGuide(guide:any){
    this.selectedGuide = guide;
  }

  gotoQuiz(lesson:any){
    console.log(lesson);
    let url:any='/quiz/Lesson/'+lesson.lesson_vguides_code+'/'+lesson.lesson_code+'/'+lesson.lesson_vguides_lang;
    //alert(url);
    this.router.navigate([url]);
  }

  visibleIndex = 0;
  disableVideoguide(chapterID:any){
    if (this.visibleIndex === chapterID) {
      this.visibleIndex = 0;
    } else {
      this.visibleIndex = chapterID;
    }
  }

}
