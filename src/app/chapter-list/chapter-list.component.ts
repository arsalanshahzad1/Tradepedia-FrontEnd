import { Component, OnInit } from '@angular/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss']
})
export class ChapterListComponent implements OnInit {

  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;

  mode: ProgressSpinnerMode = 'determinate';
  value = 0;

  userID:any="";
  ebookID:any="";
  langCode:any="";
  ebookDets:any="";
  chapterList:any=[];

  ebookQuizDets:any=[];
  chapterCompleted:number=0;


  constructor(
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
  ) { 
    if(!localStorage.getItem("UserID")==true){      
      this.router.navigate(['/login']);
    }
    
    if(!localStorage.getItem("UserID")==false){
      this.userID =localStorage.getItem("UserID");        
    }
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false){
          //this.getCouponDets(params['code']);
          this.ebookID=params['code'];
          this.langCode=params['lang'];
          this.getEbookDets();
          this.getChapterList();
          
        }
    });
  }

  getEbookDets(){
    //alert("in");    
    let ebookDets:any={ebookID:this.ebookID,langCode:this.langCode}
    this._service.getEbookDets(ebookDets)
    .subscribe(
      (data) => {
        console.log("Ebook Details Reuslt => ", data);        
        this.ebookDets = data.ebookDets;     
        this.ebookDets.imgSrc = this.imgURL+"ebooks/"+this.ebookDets.ebook_cover_image                       

        this.ebookDets.completedChapters = 0;
        this.ebookDets.stars = 0;
        this.ebookDets.value = 0;

        console.log(this.ebookDets);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  getChapterList(){
    //alert("in");    
    let ebookDets:any={ebookID:this.ebookID,langCode:this.langCode}
    this._service.getChapterList(ebookDets)
    .subscribe(
      (data) => {
        console.log("Chapter List Reuslt => ", data);        
        this.chapterList = data.chapterList;          
        if(this.chapterList.length > 0){
          this.getEbookQuizDets();          
        }
        
        for(let i=0;i<this.chapterList.length;i++){
          //this.chapterList[i].fileSrc = this.imgURL+"ebooks/"+this.chapterList[i].chapter_file
          this.chapterList[i].stars = 0;
        }
        console.log(this.chapterList);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  getEbookQuizDets(){
    //alert("in");    
    let ebookDets:any={userID:this.userID, ebookID:this.ebookID};
    this._service.getEbookQuizDets(ebookDets)
    .subscribe(
      (data) => {
        console.log("Ebook Quiz Reuslt => ", data);        
        this.ebookQuizDets = data.ebookQuizDets;     
        this.chapterCompleted = parseInt(this.ebookQuizDets.length);    
                   
        for(let i=0;i<this.chapterList.length;i++){
          for(let q=0;q<this.ebookQuizDets.length;q++){
            if(this.chapterList[i].chapter_ebook_code == this.ebookQuizDets[q].cresult_ebook_code && this.chapterList[i].chapter_code == this.ebookQuizDets[q].cresult_chapter_code){
              this.chapterList[i].stars = this.ebookQuizDets[q].cresult_total_stars;  
            }            
          }
        }
        //alert(this.chapterCompleted);
        console.log(this.chapterList);

        let chCount = 0;
        let totalStars = 0;
        for(let q=0;q<this.ebookQuizDets.length;q++){
          if(this.ebookDets.ebook_code == this.ebookQuizDets[q].cresult_ebook_code){
            chCount++;
            totalStars = totalStars + parseInt(this.ebookQuizDets[q].cresult_total_stars);  
          }            
        }
        this.ebookDets.completedChapters = chCount;
        if(totalStars>0){
          this.ebookDets.stars = Math.ceil(totalStars/chCount);
        }         
        this.ebookDets.value = (chCount / this.ebookDets.ebook_noof_chapters) * 100;
        console.log(this.ebookDets);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  showChapterDets(chapterID:any){    
    let url:any='academy/chapter-details/'+chapterID;
    //alert(url);
    this.router.navigate([url]);
  }

  gotoQuiz(chapter:any){
    console.log(chapter);
    let url:any='/quiz/Chapter/'+chapter.chapter_ebook_code+'/'+chapter.chapter_code+'/'+chapter.chapter_ebook_lang;
    //alert(url);
    this.router.navigate([url]);
  }

  visibleIndex = 0;
  disableChapter(chapterID:any){
    if (this.visibleIndex === chapterID) {
      this.visibleIndex = 0;
    } else {
      this.visibleIndex = chapterID;
    }
  }

}
