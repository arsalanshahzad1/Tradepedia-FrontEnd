import { Component, OnInit } from '@angular/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {trigger, transition, animate, style, state} from '@angular/animations';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-chapter-list',
  templateUrl: './video-chapter-list.component.html',
  styleUrls: ['./video-chapter-list.component.scss'],
  animations: [
    trigger('slideUpDown', [
      transition('void => *', [
        style({height: 0, margin: 0, padding: 0}),
        animate(200, style({height: '*', margin: '*', padding: '*'}))
      ]),
      transition('* => void', [
        style({height: '*', margin: '*', padding: '*'}),
        animate(200, style({height: 0, margin: 0, padding: 0}))
      ])
    ])
  ]
})
export class VideoChapterListComponent implements OnInit {

  languageSelected:any="";
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  mode: ProgressSpinnerMode = 'determinate';
  value = 0;
  guideList:any=[];  
  selectedGuide:any="";

  userID:any="";
  guideQuizDets:any=[];
  lessonCompleted:number=0;

  showchplist:any;

  videoID:any="";
  langCode:any="";

  pdfWidth:any = 0;
  listWidth:any;

  showPopup:number=0;
  showVideo:any = 0;

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
    
    if(!this.cookieService.get('selectedLang')==false){
      this.languageSelected = this.cookieService.get('selectedLang');        
    } else {
      this.languageSelected = "EN";      
    } 
    console.log(this.languageSelected);

    if(!localStorage.getItem("UserID")==false){
      this.userID =localStorage.getItem("UserID");        
    }

    /*window.addEventListener("message", (result:any) => {
      //console.log(result.data);
      let input:any=JSON.parse(result.data);
      //console.log(input);   
      if(input.type==="completed"){
        //alert("Video End");
        if(this.selectedGuide.lesson_quiz_code!=0){
          this.showPopup = 1;
        }          
      }          
    }, false)*/

    this._service.getQuizType.subscribe((type:any) => {
      //alert(type);
      if(type=="Video"){
        //alert("in");
        if(this.selectedGuide.lesson_quiz_code!=0){
          this.showPopup = 1;
        }
      } 
    });
  }

  ngOnInit(): void {
    this.getGuideList();

    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false){
          //this.getCouponDets(params['code']);
          this.videoID=params['code'];        
          this.langCode=params['lang'];                  
        }
    });    
    //alert(this.videoID+" "+this.langCode);
  }

  changeScreen(){
    //alert("In");
    this.showVideo = 1;
  }

  getGuideList(){
    //alert("in");    
    let lang:any={langCode:this.languageSelected};
    this._service.getGuideList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.guideList = data.guideList;   

        if(this.guideList.length > 0){
          this.getGuideQuizDets();          
        } 

        for(let i=0;i<this.guideList.length;i++){
          //this.guideList[i].fileSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.guideList[i].vguides_url);                       
          //this.guideList[i].imgSrc = this.imgURL+"guides/"+this.guideList[i].vguides_cover_image
          this.guideList[i].imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.guideList[i].vguides_cover_image);

          this.guideList[i].lessonCompleted = 0;
          this.guideList[i].stars = 0;
          this.guideList[i].value = 0;
          this.guideList[i].showchplist = 0;
        }                         
        console.log(this.guideList);

        this.selectedGuide = this.guideList[0];
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  getGuideQuizDets(){
    //alert("in");    
    let videoDets:any={userID:this.userID, videoID:''};
    this._service.getGuideQuizDets(videoDets)
    .subscribe(
      (data) => {
        console.log("Video Quiz Reuslt => ", data);        
        this.guideQuizDets = data.guideQuizDets;     
        let selectedLesson:any="";                       
        for(let i=0;i<this.guideList.length;i++){
          let chCount = 0;
          let totalStars = 0;
          let crComCount = 0;
          let lessonList:any = this.guideList[i].lessonList;
          for(let q=0;q<this.guideQuizDets.length;q++){
            if(this.guideList[i].vguides_code == this.guideQuizDets[q].lresult_vguides_code){
              chCount++;
              totalStars = totalStars + parseInt(this.guideQuizDets[q].lresult_total_stars);  
            }            
          }

          for(let c=0;c<lessonList.length;c++){
            lessonList[c].show = 0;
            lessonList[c].stars = 0;
            lessonList[c].fileSrc = this.sanitizer.bypassSecurityTrustResourceUrl(lessonList[c].lesson_url);                       
            //lessonList[c].imgSrc = this.imgURL+"guides/"+lessonList[c].lesson_image;
            lessonList[c].imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(lessonList[c].lesson_image);

            if(lessonList[c].lesson_vguides_code == this.videoID){
              this.guideList[i].showchplist = 1;
            }

            for(let q=0;q<this.guideQuizDets.length;q++){
              if(lessonList[c].lesson_vguides_code == this.guideQuizDets[q].lresult_vguides_code && lessonList[c].lesson_code == this.guideQuizDets[q].lresult_lesson_code){
                lessonList[c].stars = this.guideQuizDets[q].lresult_total_stars; 
                if(!lessonList[(c+1)]==false){
                  selectedLesson = lessonList[(c+1)];
                } else {
                  selectedLesson = "";
                }                  
              }            
            }
          }

          for(let c=0;c<lessonList.length;c++){
            if(lessonList[c].lesson_quiz_code != 0){
              if(lessonList[c].stars>0){
                crComCount++;      
                lessonList[c].show = 1;          
              } else {                              
                lessonList[c].show = 1;
                break;              
              }
            } else {
              lessonList[c].show = 1;
              crComCount++;
            }       
            if(this.videoID!="" && lessonList[c].lesson_code == this.videoID){   
              //alert("selected");
              this.guideList[i].showchplist = 1;           
              selectedLesson = lessonList[c];
            }         
          }             

          //alert(crComCount+" == "+lessonList.length);
          if(crComCount == lessonList.length){
            this.lessonCompleted++;
          }
          //alert(this.lessonCompleted);

          this.guideList[i].lessonCompleted = crComCount;
          if(totalStars>0){
            this.guideList[i].stars = Math.ceil(totalStars/chCount);
          }         
          this.guideList[i].value = (crComCount / this.guideList[i].vguides_noof_lessons) * 100;
        }
        //alert(this.lessonCompleted);
        console.log(this.guideList);

        console.log(selectedLesson);

        if(selectedLesson!=""){
          this.selectGuide(selectedLesson);         
        } else {
          this.selectGuide(this.guideList[0].lessonList[0]);         
        }

        this.selectLesson({vguides_id:'3'})
        this.selectLesson({vguides_id:'3'})
        //this.guideQuizDets.fileSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.guideQuizDets.lesson_url);
        //console.log(this.guideQuizDets);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  selectLesson(guide:any){
    console.log('asdasas ====>', guide);
    
    //this.router.navigate(['/academy/video-guide/'+guide.vguides_code+'/'+guide.vguides_lang]);
    //this.showchplist = !this.showchplist;

    for(let i=0;i<this.guideList.length;i++){
      if(guide.vguides_id == this.guideList[i].vguides_id){
        this.guideList[i].showchplist = 1;
          console.log('ssssssssssss', this.guideList[i].lessonList);
          
          this.guideList[i].lessonList.forEach((element:any) => {
            console.log('======>>>>', element.lesson_vguides_id)
            if(element.lesson_vguides_id == '3'){
              console.log('on e')
              this.selectedGuide(element)
            }
            
          });
       
      } else {
        this.guideList[i].showchplist = 0;
      }
    }
  }

  selectGuide(guide:any){
    this.showVideo = 0;
    //this.selectedGuide = guide;
    this.guideQuizDets = guide;         
    //this.guideQuizDets.fileSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.guideQuizDets.lesson_url);
    console.log(this.guideQuizDets);
  }

  gotoQuiz(lesson:any){
    console.log(lesson);
    //let url:any='/quiz/Lesson/'+lesson.lesson_vguides_code+'/'+lesson.lesson_code+'/'+lesson.lesson_vguides_lang;
    let url:any='/quiz/Lesson/'+lesson.lesson_vguides_code+'/'+lesson.lesson_code+'/'+this.languageSelected;    
    //alert(url);
    this.router.navigate([url]);
  }  

  visibleIndex:any = 0;
  disableVideoGuide(vdochapterID:any){
    if (this.visibleIndex === vdochapterID) {
      this.visibleIndex = 0;
    } else {
      this.visibleIndex = vdochapterID;
    }
  }

  visibleIndex2:any = 0;
  disableVideoguide(lesson_id:any){
    if (this.visibleIndex2 === lesson_id) {
      this.visibleIndex2 = 0;
    } else {
      this.visibleIndex2 = lesson_id;
    }
  }
  
  fullscreenBtn(){
    this.pdfWidth = !this.pdfWidth;
    this.listWidth = !this.listWidth;
  }

  closePaynowpopup(){
    this.showPopup = 0;
  }
}
