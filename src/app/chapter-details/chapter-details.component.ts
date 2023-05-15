import { Component, OnInit } from '@angular/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { PagesService } from '../services/pages.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-chapter-details',
  templateUrl: './chapter-details.component.html',
  styleUrls: ['./chapter-details.component.scss']
})
export class ChapterDetailsComponent implements OnInit {

  showConsole:any = environment.showConsole;
  imgURL:any = environment.imgUrl;

  mode: ProgressSpinnerMode = 'determinate';
  value = 0;

  chapterID:any="";  
  chapterDets:any="";  
  //samplePDF:any="http://localhost/workarea/tradepedia/web/tradepedia/src/assets/ebook1_en_chapter1.pdf";
  samplePDF:SafeResourceUrl="";
  

  constructor(
    private _service : PagesService,
    public _notification: NotificationService,
    private router : Router,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
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
          this.chapterID=params['code'];          
          this.getChapterDets();          
        }
    });    

    this.samplePDF =  this.sanitizer.bypassSecurityTrustResourceUrl("https://tradepedia.io/userfiles/ebook_html/Ebook1/ebook1.html");
  }

  gotoQuiz(){
    alert("In");
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

}
