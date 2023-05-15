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
  selector: 'app-ebooks',
  templateUrl: './ebooks.component.html',
  styleUrls: ['./ebooks.component.scss'],
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
export class EbooksComponent implements OnInit {
  
  languageSelected:any="";
  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;
  mode: ProgressSpinnerMode = 'determinate';
  value = 0;
  ebooklist:any=[];

  userID:any="";
  ebookQuizDets:any=[];
  chapterCompleted:number=0;

  showchplist:any;
  pdfWidth:any = 0;
  listWidth:any;

  chapterDets:any=""; 
  chapterID:any="";

  selectedBookChapters:any=[];

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
      if(input.message=="Chapter"){
        //alert("in");
        this.gotoQuiz(this.chapterDets);
      }       
    }, false)*/

    window.addEventListener("message", (result:any) => {
      let input:any=JSON.parse(result.data);
      if(input.message=="Next-Chapter"){
        
        const index =  this.selectedBookChapters.findIndex((object:any) => {
          return object.chapter_id == this.chapterDets.chapter_id;
        });
        let nextChapter =  ((index+1) < (this.selectedBookChapters.length-1)) ? index+1 : index;
        
        this.showChapterDets(this.selectedBookChapters[nextChapter]);
      }       
    }, false)

    this._service.getQuizType.subscribe((type:any) => {
      //alert(type);
      if(type=="Chapter"){
        //alert("in");
        this.gotoQuiz(this.chapterDets);
      } 
    });
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        console.log(params);            
        if(!params['code']==false){
          //this.getCouponDets(params['code']);
          this.chapterID=params['code'];                    
        }
        //alert(this.chapterID);
    });
    this.getEbookList();

  }

  getEbookList(){
    //alert("in");    
    let lang:any={langCode:this.languageSelected};
    this._service.getEbookList(lang)
    .subscribe(
      (data) => {
        console.log("Post Reuslt => ", data);        
        this.ebooklist = data.ebookList;     

        if(this.ebooklist.length > 0){
          this.getEbookQuizDets();          
        }            
        
        for(let i=0;i<this.ebooklist.length;i++){
          this.ebooklist[i].imgSrc = this.imgURL+"ebooks/"+this.ebooklist[i].ebook_cover_image;
          this.ebooklist[i].completedChapters = 0;
          this.ebooklist[i].stars = 0;
          this.ebooklist[i].value = 0;
          this.ebooklist[i].showchplist = 0;
          let chapterList:any = this.ebooklist[i].chapterList;

          for(let c=0;c<chapterList.length;c++){
            chapterList[c].stars = 0;            
          }
        }
        console.log(this.ebooklist);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  getEbookQuizDets(){
    //alert("in");    
    let ebookDets:any={userID:this.userID, ebookID:''};
    this._service.getEbookQuizDets(ebookDets)
    .subscribe(
      (data) => {
        console.log("Ebook Quiz Reuslt => ", data);        
        this.ebookQuizDets = data.ebookQuizDets;     
        let selectedChapter:any="";          
        for(let i=0;i<this.ebooklist.length;i++){
          let chCount = 0;
          let crComCount = 0;   
          let totalStars = 0;
          let chapterList:any = this.ebooklist[i].chapterList;

          for(let q=0;q<this.ebookQuizDets.length;q++){
            if(this.ebooklist[i].ebook_code == this.ebookQuizDets[q].cresult_ebook_code){
              chCount++;
              totalStars = totalStars + parseInt(this.ebookQuizDets[q].cresult_total_stars);  
            }            
          }

          for(let c=0;c<chapterList.length;c++){     
            chapterList[c].show = 0;  
            //alert(chapterList[c].chapter_id);
            if(this.chapterID == chapterList[c].chapter_id){
              this.ebooklist[i].showchplist = 1;
              selectedChapter=chapterList[c];
            }     
            for(let q=0;q<this.ebookQuizDets.length;q++){
              if(chapterList[c].chapter_ebook_code == this.ebookQuizDets[q].cresult_ebook_code && chapterList[c].chapter_code == this.ebookQuizDets[q].cresult_chapter_code){
                chapterList[c].stars = this.ebookQuizDets[q].cresult_total_stars;  
              }            
            }
          }
          console.log(chapterList);

          for(let c=0;c<chapterList.length;c++){
            if(chapterList[c].chapter_quiz_code != 0){
              if(chapterList[c].stars>0){
                crComCount++;                
                chapterList[c].show = 1;  
              } else {                    
                chapterList[c].show = 1;
                break;              
              }
            } else {
              crComCount++;
              chapterList[c].show = 1;
            }          
          }   

          if(chapterList.length == crComCount){
            this.chapterCompleted++;
          }

          this.ebooklist[i].completedChapters = crComCount;
          if(totalStars>0){
            this.ebooklist[i].stars = Math.ceil(totalStars/chCount);
          }         
          this.ebooklist[i].value = (crComCount / this.ebooklist[i].ebook_noof_chapters) * 100;

        }
        //alert(this.chapterCompleted);
        console.log(this.ebooklist);

        if(selectedChapter!=""){
          this.showChapterDets(selectedChapter);  
        } else {
          this.selectedBookChapters = this.ebooklist[0].chapterList;
          this.showChapterDets(this.ebooklist[0].chapterList[0]);
        }

        
        //this.chapterDets = this.ebooklist[0].chapterList[0];         
        //this.chapterDets.contentHTML = this.sanitizer.bypassSecurityTrustResourceUrl(this.chapterDets.chapter_file);
        //console.log(this.chapterDets);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }

  gotoChapter(book:any){
    console.log(book);
    //this.showchplist = !this.showchplist;
    this.selectedBookChapters = book.chapterList;
    
    for(let i=0;i<this.ebooklist.length;i++){
      if(book.ebook_id == this.ebooklist[i].ebook_id){
        this.ebooklist[i].showchplist = 1;
      } else {
        this.ebooklist[i].showchplist = 0;
      }
    }    
  }

  showChapterDets(chapter:any){   
    if(chapter.chapter_file!=""){ 
      this.chapterDets = chapter;      
      //alert(this.chapterDets.chapter_file);   
      if(this.chapterDets.chapter_file!=""){
        this.chapterDets.contentHTML = this.sanitizer.bypassSecurityTrustResourceUrl(this.chapterDets.chapter_file);
      } else {
        this.chapterDets.contentHTML = "";
      }    
      console.log(this.chapterDets);
    }
  }

  gotoQuiz(chapter:any){
    console.log(chapter);
    let url:any='/quiz/Chapter/'+chapter.chapter_ebook_code+'/'+chapter.chapter_code+'/'+chapter.chapter_ebook_lang;
    //alert(url);
    this.router.navigate([url]);
  }

  getChapterDets(){
    //alert("in");    
    let chapterDet:any={chapterID:this.chapterID};
    this._service.getChapterDets(chapterDet)
    .subscribe(
      (data) => {
        console.log("Chapter Details Reuslt => ", data);        
        this.chapterDets = data.chapterDet;     
        //this.chapterDets.fileSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgURL+"chapters/"+this.chapterDets.chapter_file+"?#toolbar=0");                       
        this.chapterDets.contentHTML = this.sanitizer.bypassSecurityTrustResourceUrl(this.chapterDets.chapter_file);
        console.log(this.chapterDets);
      },
      response => {
        console.log("POST call in error", response);                              
      });
  }
  
  visibleIndex = 0;
  disableEbook(chapterID:any){
    if (this.visibleIndex === chapterID) {
      this.visibleIndex = 0;
    } else {
      this.visibleIndex = chapterID;
    }
  }

  visibleIndex2 = 0;
  disableChapter(chapterID:any){
    if (this.visibleIndex2 === chapterID) {
      this.visibleIndex2 = 0;
    } else {
      this.visibleIndex2 = chapterID;
    }    
  }

  fullscreenBtn(){
    this.pdfWidth = !this.pdfWidth;
    this.listWidth = !this.listWidth;
  }
  

}
